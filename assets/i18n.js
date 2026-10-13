/* Temp Clipboard — UI strings (th / zh / en). UI language defaults to Thai. */
window.TCI18N = {
  order: ['th', 'zh', 'en'],
  locales: { th: 'th-TH', zh: 'zh-CN', en: 'en-GB' },
  dicts: {
    th: {
      'app.docTitle': 'Temp Clipboard — บอร์ดชั่วคราวและรูป',
      'app.h1': 'แปะไว้ตรงนี้ — คัดลอกไปใช้ที่ไหนก็ได้',
      'app.lede': 'พิมพ์ข้อความหรือแนบรูป กด “โพสต์” แล้วกดคัดลอกไปวางต่อได้ทันที · ข้อมูลเก็บไว้ในเบราว์เซอร์เครื่องนี้เท่านั้น',

      'a11y.langGroup': 'เลือกภาษา',
      'a11y.theme': 'สลับโหมดมืด/สว่าง',
      'a11y.composer': 'ช่องเขียนโพสต์',
      'a11y.attachStrip': 'รูปที่แนบไว้',
      'a11y.removeImage': 'เอารูปออก',

      'composer.placeholder': 'พิมพ์ข้อความ หรือวาง/ลากรูปมาที่นี่ (Ctrl+V)…',
      'composer.attach': 'แนบรูป',
      'composer.clear': 'ล้างช่อง',
      'composer.post': 'โพสต์',
      'composer.hint': 'วาง Ctrl+V · ลากมาวาง · เลือกไฟล์ · สูงสุด 4 รูป',
      'composer.sessionNote': 'โหมดชั่วคราวเปิดอยู่ — ข้อมูลจะไม่ถูกบันทึก และหายเมื่อปิดแท็บ',

      'posts.title': 'โพสต์ล่าสุด',
      'posts.count': '{n} โพสต์',
      'posts.size': 'ใช้พื้นที่ {size}',
      'posts.clearAll': 'ล้างทั้งหมด',
      'posts.clearConfirm': 'ยืนยันล้างทั้งหมด?',

      'post.copyText': 'คัดลอกข้อความ',
      'post.copyImage': 'คัดลอกรูป',
      'post.copyImageHint': 'จะคัดลอกรูปแรกของโพสต์นี้',
      'post.download': 'ดาวน์โหลด',
      'post.delete': 'ลบ',

      'empty.title': 'ยังไม่มีโพสต์',
      'empty.hint': 'เริ่มจากพิมพ์ข้อความหรือแนบรูปด้านล่าง แล้วกด “โพสต์” ได้เลย',

      'settings.expire': 'ลบอัตโนมัติ',
      'settings.expireOff': 'ปิด',
      'settings.expire1': '1 วัน',
      'settings.expire7': '7 วัน',
      'settings.expire30': '30 วัน',
      'settings.session': 'โหมดชั่วคราว (ไม่บันทึก)',

      'footer.note': 'ข้อมูลทั้งหมดเก็บไว้ในเบราว์เซอร์เครื่องนี้เท่านั้น (IndexedDB) — ไม่มีเซิร์ฟเวอร์ ไม่มีการส่งข้อมูลออกไป',

      'toast.posted': 'โพสต์แล้ว',
      'toast.cleared': 'ล้างทั้งหมดแล้ว',
      'toast.deleted': 'ลบโพสต์แล้ว',
      'toast.undo': 'เลิกทำ',
      'toast.undone': 'กู้คืนแล้ว',
      'toast.copyText': 'คัดลอกข้อความแล้ว ✓',
      'toast.copyImage': 'คัดลอกรูปแล้ว — ไปวางต่อได้เลย',
      'toast.copyFail': 'คัดลอกไม่สำเร็จ — ลองใหม่ หรือกดดาวน์โหลดรูปแทน',
      'toast.imgFail': 'เพิ่มรูปไม่ได้: {name}',
      'toast.quota': 'พื้นที่จัดเก็บใกล้เต็ม — ลองลบโพสต์เก่าออกบ้าง',
      'toast.expired': 'ลบโพสต์เก่าอัตโนมัติ {n} รายการ'
    },
    zh: {
      'app.docTitle': 'Temp Clipboard — 临时粘贴板',
      'app.h1': '贴在这里 — 复制到任何地方',
      'app.lede': '输入文字或添加图片，点「发布」就能复制到任何地方 · 数据只保存在此浏览器中',

      'a11y.langGroup': '选择语言',
      'a11y.theme': '切换深色/浅色模式',
      'a11y.composer': '发布编辑区',
      'a11y.attachStrip': '已添加的图片',
      'a11y.removeImage': '移除图片',

      'composer.placeholder': '输入文字，或在此粘贴 / 拖入图片（Ctrl+V）…',
      'composer.attach': '添加图片',
      'composer.clear': '清空输入',
      'composer.post': '发布',
      'composer.hint': 'Ctrl+V 粘贴 · 拖拽放入 · 选择文件 · 最多 4 张',
      'composer.sessionNote': '临时模式已开启 — 内容不会保存，关闭标签页即消失',

      'posts.title': '最新发布',
      'posts.count': '{n} 条',
      'posts.size': '已用 {size}',
      'posts.clearAll': '全部清空',
      'posts.clearConfirm': '确认全部清空？',

      'post.copyText': '复制文字',
      'post.copyImage': '复制图片',
      'post.copyImageHint': '将复制这条的第一张图片',
      'post.download': '下载',
      'post.delete': '删除',

      'empty.title': '暂无帖子',
      'empty.hint': '从下方输入文字或添加图片，然后点「发布」即可',

      'settings.expire': '自动删除',
      'settings.expireOff': '关闭',
      'settings.expire1': '1 天',
      'settings.expire7': '7 天',
      'settings.expire30': '30 天',
      'settings.session': '临时模式（不保存）',

      'footer.note': '所有数据仅保存在此浏览器中（IndexedDB）— 没有服务器，也不会外发任何数据',

      'toast.posted': '已发布',
      'toast.cleared': '已全部清空',
      'toast.deleted': '已删除帖子',
      'toast.undo': '撤销',
      'toast.undone': '已恢复',
      'toast.copyText': '文字已复制 ✓',
      'toast.copyImage': '图片已复制 — 去粘贴吧',
      'toast.copyFail': '复制失败 — 请重试，或点下载',
      'toast.imgFail': '无法添加图片：{name}',
      'toast.quota': '存储空间将满 — 试试删除一些旧内容',
      'toast.expired': '已自动删除 {n} 条旧帖子'
    },
    en: {
      'app.docTitle': 'Temp Clipboard — temporary pasteboard',
      'app.h1': 'Stick it here — copy it anywhere',
      'app.lede': 'Type a message or attach an image, hit “Post”, then copy it anywhere · Data stays in this browser only',

      'a11y.langGroup': 'Select language',
      'a11y.theme': 'Toggle dark mode',
      'a11y.composer': 'Composer',
      'a11y.attachStrip': 'Attached images',
      'a11y.removeImage': 'Remove image',

      'composer.placeholder': 'Type a message, or paste / drop an image here…',
      'composer.attach': 'Add image',
      'composer.clear': 'Clear',
      'composer.post': 'Post',
      'composer.hint': 'Paste Ctrl+V · drag & drop · pick a file · up to 4 images',
      'composer.sessionNote': 'Temporary mode is on — nothing is saved, and everything disappears when you close this tab',

      'posts.title': 'Recent posts',
      'posts.count': '{n} posts',
      'posts.count1': '1 post',
      'posts.size': 'Using {size}',
      'posts.clearAll': 'Clear all',
      'posts.clearConfirm': 'Confirm clear all?',

      'post.copyText': 'Copy text',
      'post.copyImage': 'Copy image',
      'post.copyImageHint': 'Copies the first image of this post',
      'post.download': 'Download',
      'post.delete': 'Delete',

      'empty.title': 'No posts yet',
      'empty.hint': 'Start by typing a message or attaching an image below, then hit “Post”',

      'settings.expire': 'Auto-delete',
      'settings.expireOff': 'Off',
      'settings.expire1': '1 day',
      'settings.expire7': '7 days',
      'settings.expire30': '30 days',
      'settings.session': 'Temporary mode (no saving)',

      'footer.note': 'Everything is stored in this browser only (IndexedDB) — no server, no data leaves your device',

      'toast.posted': 'Posted',
      'toast.cleared': 'Cleared',
      'toast.deleted': 'Post deleted',
      'toast.undo': 'Undo',
      'toast.undone': 'Restored',
      'toast.copyText': 'Text copied ✓',
      'toast.copyImage': 'Image copied — paste it anywhere',
      'toast.copyFail': 'Copy failed — try again or use Download',
      'toast.imgFail': 'Couldn’t add image: {name}',
      'toast.quota': 'Storage is almost full — try deleting old posts',
      'toast.expired': 'Auto-deleted {n} old post(s)'
    }
  }
};
