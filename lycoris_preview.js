'use strict'

var getFileExtension = function (fileName) {
  return (/.*\.(.+)$/.exec(fileName) || [])[1]
}

var getImageMIME = function (fileName) {
  var imageMIMEs = new Map([
    ['gif', 'image/gif'],
    ['png', 'image/png'],
    ['jpg', 'image/jpeg'],
    ['jpeg', 'image/jpeg'],
    ['webp', 'image/webp'],
    ['bmp', 'image/bmp'],
    ['svg', 'image/svg+xml'],
    ['svgz', 'image/svg+xml'],
  ])
  var extension = getFileExtension(fileName)
  return imageMIMEs.get(extension)
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

var loadImage = function (url, alt) {
  var dialogImage = dialog.querySelector('img')
  dialogImage.src = url
  dialogImage.alt = alt
  dialogImage.onload = function () {
    URL.revokeObjectURL(this.src)
    dialog.showModal()
  }
}

var attachments = query('.attachments > table')
var imageAttachments = attachments.filter(function (attachment) {
  var name = attachment.querySelector('b').textContent.trim()
  return !!getImageMIME(name)
})

imageAttachments.forEach(function (attachment) {
  var nameElem = attachment.querySelector('b')
  var downloadElem = attachment.querySelector('b ~ a:last-of-type')
  var viewElem = attachment.querySelector('a[target]')
  var thumbnailElem = attachment.querySelector('[colspan="3"] > a')

  var fileName = nameElem.textContent.trim()

  if (!! viewElem && !!thumbnailElem) {
    var imageURL = viewElem.href
    var elems = [nameElem, viewElem, thumbnailElem]
    elems.forEach(function (elem) {
      elem.onclick = function (e) {
        e.preventDefault()
        loadImage(imageURL, fileName)
      }
    })
  }
  else {
    nameElem.onclick = function () {
      var url = downloadElem.href
      var mime = getImageMIME(fileName)
      request(url, { type: 'blob' }).then(function (response) {
        var blob = new Blob([response.body], { type: mime })
        return URL.createObjectURL(blob)
      }).then(function (objURL) {
        loadImage(objURL, fileName)
      }).catch(function (e) {
        console.error(e)
      })
    }
  }

})
