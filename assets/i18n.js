/* Temp Clipboard — UI strings (th / lo / en). UI language defaults to Thai. */
window.TCI18N = {
  order: ['th', 'lo', 'en'],
  locales: { th: 'th-TH', lo: 'lo-LA', en: 'en-GB' },
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
      'empty.hint': 'เริ่มจากพิมพ์ข้อความหรือแนบรูปด้านบน แล้วกด “โพสต์” ได้เลย',

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
    lo: {
      'app.docTitle': 'Temp Clipboard — ບອດຊົ່ວຄາວ ແລະ ຮູບ',
      'app.h1': 'ວາງໄວ້ບ່ອນນີ້ — ຄັດລອກໄປໃຊ້ບ່ອນໃດກໍໄດ້',
      'app.lede': 'ພິມຂໍ້ຄວາມ ຫຼື ແນບຮູບ ແລ້ວກົດ “ໂພສ” ຈາກນັ້ນກົດຄັດລອກໄປວາງຕໍ່ໄດ້ເລີຍ · ຂໍ້ມູນເກັບໄວ້ໃນບຣາວເຊີຂອງເຄື່ອງນີ້ເທົ່ານັ້ນ',

      'a11y.langGroup': 'ເລືອກພາສາ',
      'a11y.theme': 'ສະຫຼັບໂໝດມືດ/ແຈ້ງ',
      'a11y.composer': 'ຊ່ອງຂຽນໂພສ',
      'a11y.attachStrip': 'ຮູບທີ່ແນບໄວ້',
      'a11y.removeImage': 'ເອົາຮູບອອກ',

      'composer.placeholder': 'ພິມຂໍ້ຄວາມ ຫຼື ວາງ/ລາກຮູບມາທີ່ນີ້…',
      'composer.attach': 'ແນບຮູບ',
      'composer.clear': 'ລ້າງຊ່ອງ',
      'composer.post': 'ໂພສ',
      'composer.hint': 'ວາງ Ctrl+V · ລາກມາວາງ · ເລືອກໄຟລ໌ · ສູງສຸດ 4 ຮູບ',
      'composer.sessionNote': 'ໂໝດຊົ່ວຄາວເປີດຢູ່ — ຂໍ້ມູນຈະບໍ່ຖືກບັນທຶກ ແລະ ຈະຫາຍໄປເມື່ອປິດແທັບ',

      'posts.title': 'ໂພສຫຼ້າສຸດ',
      'posts.count': '{n} ໂພສ',
      'posts.size': 'ໃຊ້ພື້ນທີ່ {size}',
      'posts.clearAll': 'ລ້າງທັງໝົດ',
      'posts.clearConfirm': 'ຢືນຢັນລ້າງທັງໝົດ?',

      'post.copyText': 'ຄັດລອກຂໍ້ຄວາມ',
      'post.copyImage': 'ຄັດລອກຮູບ',
      'post.copyImageHint': 'ຈະຄັດລອກຮູບທຳອິດຂອງໂພສນີ້',
      'post.download': 'ດາວໂຫລດ',
      'post.delete': 'ລຶບ',

      'empty.title': 'ຍັງບໍ່ມີໂພສ',
      'empty.hint': 'ເລີ່ມຈາກການພິມຂໍ້ຄວາມ ຫຼື ແນບຮູບຂ້າງເທິງ ແລ້ວກົດ “ໂພສ” ໄດ້ເລີຍ',

      'settings.expire': 'ລຶບອັດຕະໂນມັດ',
      'settings.expireOff': 'ປິດ',
      'settings.expire1': '1 ວັນ',
      'settings.expire7': '7 ວັນ',
      'settings.expire30': '30 ວັນ',
      'settings.session': 'ໂໝດຊົ່ວຄາວ (ບໍ່ບັນທຶກ)',

      'footer.note': 'ຂໍ້ມູນທັງໝົດເກັບໄວ້ໃນບຣາວເຊີຂອງເຄື່ອງນີ້ເທົ່ານັ້ນ (IndexedDB) — ບໍ່ມີເຊີບເວີ ບໍ່ມີການສົ່ງຂໍ້ມູນອອກໄປ',

      'toast.posted': 'ໂພສແລ້ວ',
      'toast.cleared': 'ລ້າງທັງໝົດແລ້ວ',
      'toast.deleted': 'ລຶບໂພສແລ້ວ',
      'toast.undo': 'ຍ້ອນກັບ',
      'toast.undone': 'ກູ້ຄືນແລ້ວ',
      'toast.copyText': 'ຄັດລອກຂໍ້ຄວາມແລ້ວ ✓',
      'toast.copyImage': 'ຄັດລອກຮູບແລ້ວ — ໄປວາງຕໍ່ໄດ້ເລີຍ',
      'toast.copyFail': 'ຄັດລອກບໍ່ສຳເລັດ — ລອງໃໝ່ ຫຼື ກົດດາວໂຫລດຮູບແທນ',
      'toast.imgFail': 'ເພີ່ມຮູບບໍ່ໄດ້: {name}',
      'toast.quota': 'ພື້ນທີ່ເກັບຂໍ້ມູນໃກ້ເຕັມ — ລອງລຶບໂພສເກົ່າອອກ',
      'toast.expired': 'ລຶບໂພສເກົ່າອັດຕະໂນມັດ {n} ລາຍການ'
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
      'empty.hint': 'Start by typing a message or attaching an image above, then hit “Post”',

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
