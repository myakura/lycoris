'use strict'

var getFileExtension = function (fileName) {
  return (/.*\.(.+)$/.exec(fileName) || [])[1]
}

//set up dialog
var dialog = document.createElement('dialog')
dialog.classList.add('lycoris-dialog')
dialog.innerHTML = '<img><br><button>Close</button>'
dialog.querySelector('button').onclick = function (e) {
  e.preventDefault()
  dialog.close()
}
dialog.onclick = function (e) {
  if (dialog.open) {
    dialog.close()
  }
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
  return images.indexOf(getFileExtension(name)) > -1
})

imageAttachments.forEach(function (attachment) {
  var nameElem = attachment.querySelector('b')
  var viewElem = attachment.querySelector('a[target]')
  var thumbnailElem = attachment.querySelector('[colspan="3"] > a')

  var fileName = nameElem.textContent.trim()
  var imageURL = new URL(viewElem.href)

  var loadImage = function () {
    var dialogImage = dialog.querySelector('img')
    dialogImage.src = imageURL
    dialogImage.alt = fileName
    dialogImage.onload = function () {
      dialog.showModal()
    }
  }

  var elems = [nameElem, viewElem, thumbnailElem]
  elems.forEach(function (elem) {
    elem.addEventListener('click', function (e) {
      e.preventDefault()
      loadImage()
    })
  })
})