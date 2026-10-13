/* Temp Clipboard — app logic
 * - IndexedDB storage (posts + settings)
 * - Composer: text + up to 4 images (paste / drag-drop / file picker)
 * - Images compressed to JPEG (max 1600px) before storing
 * - Clipboard: copy text / copy image (PNG) with fallbacks
 * - i18n th/lo/en · light/dark theme · auto-expire · temporary mode
 */
(() => {
  'use strict';
  const T = window.TCI18N;

  /* ---------- config ---------- */
  const DB_NAME = 'temp-thpl-me';
  const DB_VER = 1;
  const STORE_POSTS = 'posts';
  const STORE_META = 'meta';
  const MAX_IMAGES = 4;
  const MAX_DIM = 1600;
  const JPEG_QUALITY = 0.85;
  const HARD_FILE_LIMIT = 25 * 1024 * 1024;
  const QUOTA_WARN = 60 * 1024 * 1024;

  /* ---------- dom ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const el = {
    draft: $('#draft'),
    attachStrip: $('#attach-strip'),
    fileInput: $('#file-input'),
    btnAttach: $('#btn-attach'),
    btnClearDraft: $('#btn-clear-draft'),
    btnPost: $('#btn-post'),
    tempNote: $('#temp-note'),
    feed: $('#feed'),
    empty: $('#empty'),
    stats: $('#stats'),
    btnClearAll: $('#btn-clear-all'),
    expireSelect: $('#expire-select'),
    sessionMode: $('#session-mode'),
    toast: $('#toast'),
    themeToggle: $('#theme-toggle'),
    composer: $('#composer'),
    langs: Array.from(document.querySelectorAll('.lang'))
  };

  /* ---------- state ---------- */
  let posts = [];          // newest first
  let settings = { lang: null, theme: null, expireDays: 0, session: false };
  let draftImages = [];    // { id, blob, url, w, h, name }
  let lastDeleted = null;  // { post, index }
  let clearArmed = false;
  let clearTimer = 0;
  let liveURLs = [];
  let quotaWarned = false;
  let dbPromise = null;
  let readyResolve = null;
  const readyPromise = new Promise((r) => { readyResolve = r; });

  /* ---------- i18n ---------- */
  const t = (key, params) => {
    const dict = T.dicts[settings.lang] || T.dicts.th;
    let s = dict[key] != null ? dict[key] : (T.dicts.th[key] != null ? T.dicts.th[key] : key);
    if (params) for (const k of Object.keys(params)) s = s.split('{' + k + '}').join(String(params[k]));
    return s;
  };

  /* ---------- database ---------- */
  function openDB() {
    return new Promise((resolve, reject) => {
      const rq = indexedDB.open(DB_NAME, DB_VER);
      rq.onupgradeneeded = () => {
        const db = rq.result;
        if (!db.objectStoreNames.contains(STORE_POSTS)) db.createObjectStore(STORE_POSTS, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORE_META)) db.createObjectStore(STORE_META, { keyPath: 'key' });
      };
      rq.onsuccess = () => resolve(rq.result);
      rq.onerror = () => reject(rq.error);
    });
  }
  const db = () => (dbPromise || (dbPromise = openDB()));

  async function idbAll(store) {
    const d = await db();
    return new Promise((res, rej) => { const tx = d.transaction(store, 'readonly'); const rq = tx.objectStore(store).getAll(); rq.onsuccess = () => res(rq.result || []); rq.onerror = () => rej(rq.error); });
  }
  async function idbPut(store, val) {
    const d = await db();
    return new Promise((res, rej) => { const tx = d.transaction(store, 'readwrite'); tx.objectStore(store).put(val); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); });
  }
  async function idbDel(store, key) {
    const d = await db();
    return new Promise((res, rej) => { const tx = d.transaction(store, 'readwrite'); tx.objectStore(store).delete(key); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); });
  }
  async function idbClear(store) {
    const d = await db();
    return new Promise((res, rej) => { const tx = d.transaction(store, 'readwrite'); tx.objectStore(store).clear(); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); });
  }

  const persistPost = async (post) => {
    if (settings.session) return;
    try { await idbPut(STORE_POSTS, post); } catch (e) { handleQuota(e); }
  };
  const removePostFromDB = async (id) => {
    if (settings.session) return;
    try { await idbDel(STORE_POSTS, id); } catch (e) { /* ignore */ }
  };
  const persistMeta = async () => {
    try { await idbPut(STORE_META, { key: 'settings', value: settings }); } catch (e) { /* ignore */ }
  };
  function handleQuota(err) {
    if (quotaWarned) return;
    quotaWarned = true;
    const msg = String((err && (err.name || err.message)) || '');
    if (/quota|storage/i.test(msg)) showToast(t('toast.quota'));
  }

  /* ---------- utils ---------- */
  const uid = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  function fmtBytes(n) {
    if (!n) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return (n >= 10 || i === 0 ? Math.round(n) : n.toFixed(1)) + ' ' + units[i];
  }
  function fmtDate(ms) {
    try {
      return new Intl.DateTimeFormat(T.locales[settings.lang] || 'th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(ms));
    } catch (e) { return new Date(ms).toLocaleString(); }
  }
  const postSize = (p) => (p.text ? new Blob([p.text]).size : 0) + (p.images || []).reduce((a, im) => a + (im.blob ? im.blob.size : 0), 0);

  /* ---------- theme ---------- */
  function applyTheme() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = settings.theme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }

  /* ---------- language ---------- */
  function detectLang() {
    if (settings.lang && T.dicts[settings.lang]) return settings.lang;
    const langs = navigator.languages || [navigator.language || ''];
    for (const l of langs) {
      const v = String(l).toLowerCase();
      if (v.indexOf('lo') === 0) return 'lo';
      if (v.indexOf('th') === 0) return 'th';
      if (v.indexOf('en') === 0) return 'en';
    }
    return 'th';
  }
  function applyLang(lang) {
    settings.lang = lang;
    document.documentElement.lang = lang;
    document.title = t('app.docTitle');
    document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = t(n.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-ph]').forEach((n) => { n.setAttribute('placeholder', t(n.getAttribute('data-i18n-ph'))); });
    document.querySelectorAll('[data-i18n-aria]').forEach((n) => { n.setAttribute('aria-label', t(n.getAttribute('data-i18n-aria'))); });
    el.langs.forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
    el.expireSelect.value = String(settings.expireDays || 0);
    el.sessionMode.checked = !!settings.session;
    el.tempNote.hidden = !settings.session;
    render();
  }

  /* ---------- toast ---------- */
  let toastTimer = 0;
  function showToast(msg, opts) {
    opts = opts || {};
    el.toast.innerHTML = '';
    const span = document.createElement('span');
    span.textContent = msg;
    el.toast.append(span);
    if (opts.actionLabel && typeof opts.onAction === 'function') {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'toast-action'; b.textContent = opts.actionLabel;
      b.addEventListener('click', () => { hideToast(); opts.onAction(); });
      el.toast.append(b);
    }
    el.toast.hidden = false;
    requestAnimationFrame(() => el.toast.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, opts.ms || 4200);
  }
  function hideToast() {
    el.toast.classList.remove('show');
    setTimeout(() => { el.toast.hidden = true; }, 220);
  }

  /* ---------- images ---------- */
  async function loadBitmap(file) {
    if (window.createImageBitmap) {
      const bmp = await createImageBitmap(file);
      return { width: bmp.width, height: bmp.height, source: bmp, close: () => { if (bmp.close) bmp.close(); } };
    }
    return new Promise((res, rej) => {
      const img = new Image();
      const u = URL.createObjectURL(file);
      img.onload = () => res({ width: img.naturalWidth, height: img.naturalHeight, source: img, close: () => URL.revokeObjectURL(u) });
      img.onerror = () => { URL.revokeObjectURL(u); rej(new Error('decode failed')); };
      img.src = u;
    });
  }
  async function compressImage(file) {
    const bmp = await loadBitmap(file);
    const scale = Math.min(1, MAX_DIM / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(bmp.source, 0, 0, w, h);
    bmp.close();
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', JPEG_QUALITY));
    if (!blob) throw new Error('encode failed');
    return { blob, w, h };
  }
  async function addFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => f && f.type && f.type.indexOf('image/') === 0);
    if (!files.length) return;
    for (const f of files) {
      if (draftImages.length >= MAX_IMAGES) break;
      if (f.size > HARD_FILE_LIMIT) { showToast(t('toast.imgFail', { name: f.name || 'image' })); continue; }
      try {
        const out = await compressImage(f);
        draftImages.push({ id: uid(), blob: out.blob, url: URL.createObjectURL(out.blob), w: out.w, h: out.h, name: f.name || 'image.jpg' });
      } catch (e) {
        showToast(t('toast.imgFail', { name: f.name || 'image' }));
      }
    }
    renderAttach();
    updatePostButton();
  }
  function renderAttach() {
    el.attachStrip.innerHTML = '';
    if (!draftImages.length) { el.attachStrip.hidden = true; return; }
    el.attachStrip.hidden = false;
    for (const im of draftImages) {
      const item = document.createElement('div');
      item.className = 'attach-item';
      const img = document.createElement('img'); img.src = im.url; img.alt = '';
      const rm = document.createElement('button');
      rm.type = 'button'; rm.className = 'rm'; rm.textContent = '✕';
      rm.setAttribute('aria-label', t('a11y.removeImage'));
      rm.addEventListener('click', () => {
        URL.revokeObjectURL(im.url);
        draftImages = draftImages.filter((x) => x.id !== im.id);
        renderAttach(); updatePostButton();
      });
      item.append(img, rm);
      el.attachStrip.append(item);
    }
  }
  function clearDraft() {
    draftImages.forEach((im) => URL.revokeObjectURL(im.url));
    draftImages = [];
    el.draft.value = '';
    autoGrow();
    renderAttach();
    updatePostButton();
  }
  function updatePostButton() { el.btnPost.disabled = !el.draft.value.trim() && !draftImages.length; }
  function autoGrow() {
    el.draft.style.height = 'auto';
    el.draft.style.height = Math.min(el.draft.scrollHeight, 320) + 'px';
  }

  /* ---------- render ---------- */
  function render() {
    liveURLs.forEach((u) => URL.revokeObjectURL(u));
    liveURLs = [];
    el.feed.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (const p of posts) frag.append(renderPost(p));
    el.feed.append(frag);
    el.empty.hidden = posts.length > 0;
    renderStats();
  }
  function renderStats() {
    const count = posts.length;
    const size = posts.reduce((a, p) => a + postSize(p), 0);
    const c = (settings.lang === 'en' && count === 1) ? t('posts.count1') : t('posts.count', { n: count });
    el.stats.textContent = c + ' · ' + t('posts.size', { size: fmtBytes(size) });
  }
  const ICON_PATHS = {
    copy: '<rect x="9" y="9" width="11.5" height="11.5" rx="2.5"/><path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5"/>',
    image: '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="3.6"/><circle cx="9" cy="9.4" r="1.7"/><path d="M20.8 15.2 16 10.8 6.4 20.8"/>',
    download: '<path d="M12 3.5v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 20.5h15"/>',
    trash: '<path d="M4.5 6.5h15"/><path d="M9.5 6V4.4a1.4 1.4 0 0 1 1.4-1.4h2.2a1.4 1.4 0 0 1 1.4 1.4V6"/><path d="M6.5 6.5 7.4 19a1.8 1.8 0 0 0 1.8 1.6h5.6a1.8 1.8 0 0 0 1.8-1.6l.9-12.5"/>'
  };
  function svgIcon(name) {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON_PATHS[name] + '</svg>';
  }
  function makeBtn(cls, iconName, label, onClick, title) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    if (iconName) b.insertAdjacentHTML('beforeend', svgIcon(iconName));
    const s = document.createElement('span');
    s.textContent = label;
    b.append(s);
    if (title) b.title = title;
    b.addEventListener('click', onClick);
    return b;
  }
  function renderPost(p) {
    const article = document.createElement('article');
    article.className = 'post';
    article.dataset.id = p.id;

    const time = document.createElement('time');
    time.className = 'post-time';
    time.dateTime = new Date(p.createdAt).toISOString();
    time.textContent = fmtDate(p.createdAt);
    article.append(time);

    if (p.text) {
      const div = document.createElement('div');
      div.className = 'post-text';
      div.textContent = p.text;
      article.append(div);
    }
    if (p.images && p.images.length) {
      const grid = document.createElement('div');
      grid.className = 'post-imgs count-' + Math.min(p.images.length, 4);
      for (const im of p.images) {
        const url = URL.createObjectURL(im.blob);
        liveURLs.push(url);
        const a = document.createElement('a');
        a.href = url; a.target = '_blank'; a.rel = 'noopener';
        const img = document.createElement('img');
        img.src = url; img.alt = ''; img.loading = 'lazy';
        a.append(img);
        grid.append(a);
      }
      article.append(grid);
    }

    const actions = document.createElement('div');
    actions.className = 'post-actions';
    if (p.text) actions.append(makeBtn('btn sm copy', 'copy', t('post.copyText'), () => doCopyText(p.text)));
    if (p.images && p.images.length && canCopyImage()) {
      actions.append(makeBtn('btn sm copy', 'image', t('post.copyImage'), () => doCopyImage(p.images[0]), p.images.length > 1 ? t('post.copyImageHint') : ''));
    }
    if (p.images && p.images.length) actions.append(makeBtn('btn sm', 'download', t('post.download'), () => doDownload(p)));
    actions.append(makeBtn('btn sm del', 'trash', t('post.delete'), () => doDelete(p)));
    article.append(actions);
    return article;
  }

  /* ---------- clipboard ---------- */
  const canCopyImage = () => !!(navigator.clipboard && window.ClipboardItem);
  function legacyCopyText(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if (!ok) throw new Error('copy failed');
  }
  async function doCopyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      else legacyCopyText(text);
      showToast(t('toast.copyText'));
    } catch (e) {
      try { legacyCopyText(text); showToast(t('toast.copyText')); }
      catch (e2) { showToast(t('toast.copyFail')); }
    }
  }
  function blobToPng(blob) {
    if (blob.type === 'image/png') return Promise.resolve(blob);
    return new Promise((res, rej) => {
      const img = new Image();
      const u = URL.createObjectURL(blob);
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        URL.revokeObjectURL(u);
        c.toBlob((b) => { b ? res(b) : rej(new Error('encode failed')); }, 'image/png');
      };
      img.onerror = () => { URL.revokeObjectURL(u); rej(new Error('decode failed')); };
      img.src = u;
    });
  }
  async function doCopyImage(image) {
    try {
      if (!canCopyImage()) throw new Error('unsupported');
      const item = new ClipboardItem({ 'image/png': blobToPng(image.blob) });
      await navigator.clipboard.write([item]);
      showToast(t('toast.copyImage'));
    } catch (e) { showToast(t('toast.copyFail')); }
  }
  function doDownload(p) {
    const im = p.images && p.images[0];
    if (!im) return;
    const d = new Date(p.createdAt);
    const pad = (n) => String(n).padStart(2, '0');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(im.blob);
    a.download = 'temp-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes()) + '.jpg';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  /* ---------- post actions ---------- */
  async function submit() {
    const text = el.draft.value.trim();
    if (!text && !draftImages.length) return;
    const post = {
      id: uid(),
      createdAt: Date.now(),
      text: text,
      images: draftImages.map((im) => ({ id: im.id, blob: im.blob, w: im.w, h: im.h, name: im.name }))
    };
    posts.unshift(post);
    await persistPost(post);
    clearDraft();
    render();
    showToast(t('toast.posted'));
    el.draft.focus();
  }
  function doDelete(p) {
    const index = posts.findIndex((x) => x.id === p.id);
    if (index < 0) return;
    posts.splice(index, 1);
    lastDeleted = { post: p, index: index };
    removePostFromDB(p.id);
    render();
    showToast(t('toast.deleted'), { actionLabel: t('toast.undo'), onAction: undoDelete, ms: 6000 });
  }
  async function undoDelete() {
    if (!lastDeleted) return;
    const post = lastDeleted.post;
    const index = lastDeleted.index;
    lastDeleted = null;
    posts.splice(Math.min(index, posts.length), 0, post);
    await persistPost(post);
    render();
    showToast(t('toast.undone'));
  }
  async function clearAll() {
    if (!clearArmed) {
      clearArmed = true;
      el.btnClearAll.classList.add('armed');
      el.btnClearAll.textContent = t('posts.clearConfirm');
      clearTimer = setTimeout(() => {
        clearArmed = false;
        el.btnClearAll.classList.remove('armed');
        el.btnClearAll.textContent = t('posts.clearAll');
      }, 3500);
      return;
    }
    clearTimeout(clearTimer);
    clearArmed = false;
    el.btnClearAll.classList.remove('armed');
    el.btnClearAll.textContent = t('posts.clearAll');
    posts = [];
    lastDeleted = null;
    try { await idbClear(STORE_POSTS); } catch (e) { /* ignore */ }
    render();
    showToast(t('toast.cleared'));
  }
  async function sweepExpired() {
    const days = Number(settings.expireDays) || 0;
    if (!days) return 0;
    const cutoff = Date.now() - days * 86400000;
    const old = posts.filter((p) => p.createdAt < cutoff);
    if (!old.length) return 0;
    posts = posts.filter((p) => p.createdAt >= cutoff);
    if (!settings.session) {
      for (const p of old) { try { await idbDel(STORE_POSTS, p.id); } catch (e) { /* ignore */ } }
    }
    render();
    showToast(t('toast.expired', { n: old.length }));
    return old.length;
  }

  /* ---------- wiring ---------- */
  function wire() {
    el.draft.addEventListener('input', () => { autoGrow(); updatePostButton(); });
    el.draft.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); submit(); }
    });
    el.draft.addEventListener('paste', (e) => {
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      const files = [];
      for (const it of items) {
        if (it.kind === 'file' && it.type && it.type.indexOf('image/') === 0) {
          const f = it.getAsFile();
          if (f) files.push(f);
        }
      }
      if (files.length) { e.preventDefault(); addFiles(files); }
    });
    el.btnAttach.addEventListener('click', () => el.fileInput.click());
    el.fileInput.addEventListener('change', () => { addFiles(el.fileInput.files); el.fileInput.value = ''; });
    el.btnClearDraft.addEventListener('click', clearDraft);
    el.btnPost.addEventListener('click', submit);
    el.btnClearAll.addEventListener('click', clearAll);

    const hasFiles = (e) => !!(e.dataTransfer && Array.from(e.dataTransfer.types || []).indexOf('Files') !== -1);
    ['dragenter', 'dragover'].forEach((ev) => el.composer.addEventListener(ev, (e) => { if (hasFiles(e)) { e.preventDefault(); el.composer.classList.add('drag'); } }));
    ['dragleave', 'drop'].forEach((ev) => el.composer.addEventListener(ev, () => el.composer.classList.remove('drag')));
    el.composer.addEventListener('drop', (e) => {
      if (hasFiles(e)) { e.preventDefault(); addFiles(e.dataTransfer.files); }
    });
    window.addEventListener('dragover', (e) => { if (hasFiles(e)) e.preventDefault(); });
    window.addEventListener('drop', (e) => {
      if (hasFiles(e) && !el.composer.contains(e.target)) {
        const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type && f.type.indexOf('image/') === 0);
        if (files.length) { e.preventDefault(); addFiles(files); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      }
    });

    el.langs.forEach((b) => b.addEventListener('click', () => { applyLang(b.dataset.lang); persistMeta(); }));
    el.themeToggle.addEventListener('click', () => {
      settings.theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme();
      persistMeta();
    });
    el.expireSelect.addEventListener('change', () => {
      settings.expireDays = Number(el.expireSelect.value) || 0;
      persistMeta();
      sweepExpired();
    });
    el.sessionMode.addEventListener('change', () => {
      settings.session = el.sessionMode.checked;
      el.tempNote.hidden = !settings.session;
      persistMeta();
    });

    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => { if (!settings.theme) applyTheme(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* ---------- init ---------- */
  async function init() {
    try {
      const metas = await idbAll(STORE_META);
      const rec = metas.find((m) => m.key === 'settings');
      if (rec && rec.value) settings = Object.assign(settings, rec.value);
    } catch (e) { /* ignore */ }
    settings.lang = detectLang();
    applyTheme();
    wire();
    try {
      posts = await idbAll(STORE_POSTS);
      posts.sort((a, b) => b.createdAt - a.createdAt);
    } catch (e) { posts = []; }
    applyLang(settings.lang);
    updatePostButton();
    autoGrow();
    await sweepExpired();
    render();

    const total = posts.reduce((a, p) => a + postSize(p), 0);
    if (total > QUOTA_WARN) { quotaWarned = true; showToast(t('toast.quota')); }
    if (readyResolve) readyResolve();
  }
  document.addEventListener('DOMContentLoaded', init);

  /* ---------- service worker ---------- */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }

  /* ---------- local QA hook (harmless in production) ---------- */
  window.__TC__ = {
    ready: readyPromise,
    submit: submit,
    addFiles: addFiles,
    state: () => ({ count: posts.length, settings: settings, posts: posts.map((p) => ({ id: p.id, text: p.text, images: (p.images || []).length })) })
  };
})();
