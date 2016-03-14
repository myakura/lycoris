'use strict'

const getFileExtension = (fileName) => {
  return (/.*\.(.+)$/.exec(fileName) || [])[1]
}

const getImageMIME = (fileName) => {
  const imageMIMEs = new Map([
    ['gif', 'image/gif'],
    ['png', 'image/png'],
    ['jpg', 'image/jpeg'],
    ['jpeg', 'image/jpeg'],
    ['webp', 'image/webp'],
    ['bmp', 'image/bmp'],
    ['svg', 'image/svg+xml'],
    ['svgz', 'image/svg+xml'],
  ])
  const extension = `${getFileExtension(fileName)}`.toLowerCase()
  return imageMIMEs.get(extension)
}

//set up dialog
const dialog = document.createElement('dialog')
dialog.classList.add('lycoris-dialog')
dialog.appendChild(new Image())
dialog.onclick = () => {
  if (dialog.open) {
    dialog.close()
  }
}
dialog.oncancel = () => {
  dialog.close()
}
dialog.onclose = () => {
  let dialogImage = dialog.querySelector('img')
  dialogImage.src = ''
  dialogImage.alt = ''
}
document.body.appendChild(dialog)

const loadImage = (url, alt) => {
  let dialogImage = dialog.querySelector('img')
  dialogImage.src = url
  dialogImage.alt = alt
  dialogImage.onload = function () {
    URL.revokeObjectURL(this.src)
    dialog.showModal()
  }
}

// if there is attachment add preview image (if not)
let attachments = Array.from(document.querySelectorAll('.attachments > table'))
let imageAttachments = attachments.filter(attachment => {
  let name = attachment.querySelector('b').textContent.trim()
  return !!getImageMIME(name)
})

imageAttachments.forEach(attachment => {
  let nameElem = attachment.querySelector('b')
  let downloadElem = attachment.querySelector('b ~ a:last-of-type')
  let viewElem = attachment.querySelector('a[target]')
  let thumbnailElem = attachment.querySelector('[colspan="3"] > a')

  nameElem.classList.add('lycoris-filename')

  let fileName = nameElem.textContent.trim()

  if (!!viewElem && !!thumbnailElem) {
    let imageURL = viewElem.href
    let elems = [nameElem, viewElem, thumbnailElem]
    elems.forEach(elem => {
      elem.onclick = e => {
        e.preventDefault()
        loadImage(imageURL, fileName)
      }
    })
  }
  else {
    nameElem.onclick = () => {
      let url = downloadElem.href
      let mime = getImageMIME(fileName)
      fetch(url)
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(objURL => {
        loadImage(objURL, fileName)
      })
      .catch(console.error)
    }
  }
})