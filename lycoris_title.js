'use strict'

var pname = document.querySelector('#pname span').textContent.trim()
var revision = document.querySelector('#colcontrol div:nth-last-of-type(2) b:last-child').textContent.trim()
var message = document.querySelector('.wrap').textContent.trim()
var summary = /^(.+)\n?/.exec(message)[1]
document.title = revision + ' - ' + pname + ' \u2014 ' + summary