'use strict'

//set up dialog
var dialog = document.createElement('dialog')
dialog.classList.add('lycoris-dialog')
dialog.innerHTML = '<img><br><button>Close</button>'
dialog.querySelector('button').onclick = function (e) {
  e.preventDefault()
  dialog.close()
}
dialog.oncancel = function () {
  dialog.close()
}
dialog.onclose = function () {
  var dialogImage = dialog.querySelector('img')
  dialogImage.src = ''
  dialogImage.alt = ''
}
document.body.appendChild(dialog)

var attachments = query('.attachments > table')
var imageAttachments = attachments.filter(function (attachment) {
  // might be able to support other previewable files (SVG, BMP, etc.)
  var images = ['gif', 'jpg', 'jpeg', 'png']
  var name = attachment.querySelector('b').textContent.trim()
  return images.indexOf(/.*\.(.*)$/.exec(name)[1]) > -1
})

imageAttachments.forEach(function (attachment) {
  var name = attachment.querySelector('b').textContent.trim()
  var url = new URL(attachment.querySelector('a[target]').href)

  var a = attachment.querySelector('[colspan="3"] > a')
  a.addEventListener('click', function (e) {
    e.preventDefault()
    var dialogImage = dialog.querySelector('img')
    dialogImage.src = a.href
    dialogImage.alt = name
    dialog.showModal()
  })
})