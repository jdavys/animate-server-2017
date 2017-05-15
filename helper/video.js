'use strict'

//archivos
const fs = require('fs')
const path = require('path');
const uuid = require('uuid');
const os = require('os')
const async = require('async')
const EventEmitter = require('events').EventEmitter //modulo del core
const dataUriBuffer = require('data-uri-to-buffer')

module.exports = function(images){
  let events= new EventEmitter()
  let count=0
  let baseName=uuid.v4()
  let tmpDir = os.tmpDir()

  async.series([
    decodeImages,
    createVideo,
    encodeVideo,
    cleanup], convertFinishing)

  function decodeImages(done){
    //done()
    async.eachSeries(images,decodeImage,done)

  }

  function decodeImage(image,done){
    let fileName = `${baseName}-${count++}.jpg`
    let buffer = dataUriBuffer(image)
    let wr = fs.createWriteStream(path.join(tmpDir,fileName))

    wr.on('error',done)
      .end(buffer,done)

    events.emit('log',`Converting ${fileName}`)
  }

  function createVideo(done){
    done()
  }

  function encodeVideo(done){
    done()
  }

  function cleanup(done){
    done()
  }

  function convertFinishing(err){
    setTimeout(function(){
      events.emit('video','this will be the encoded video')
    },1000)
  }



  return events

}
