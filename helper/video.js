'use strict'

//archivos
const fs = require('fs')
const path = require('path');
const uuid = require('uuid');
const os = require('os')
const async = require('async')
const EventEmitter = require('events').EventEmitter //modulo del core
const dataUriBuffer = require('data-uri-to-buffer')
const listFiles = require('./list');
const ffmpeg = require('./ffmpeg');
const concat = require('concat-stream');

module.exports = function(images){
  let events= new EventEmitter()
  let count=0
  let baseName=uuid.v4()
  let tmpDir = os.tmpDir()
  let video

  async.series([
    decodeImages,
    createVideo,
    encodeVideo,
    cleanup
  ], convertFinishing)

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
    events.emit('log',`video ${baseName}`)
    ffmpeg({
      baseName: baseName,
      folder: tmpDir
    }, done)
  }

  function encodeVideo(done){
    let fileName = `${baseName}.webm`
    let rs= fs.createReadStream(path.join(tmpDir,fileName))

    events.emit('log', `Encoding video ${fileName}`)

    rs.pipe(concat(function(videoBuffer){
      video=`data:video/webm;base64,${videoBuffer.toString('base64')}`
      done()
    }))
    rs.on('error',done)
  }


  function cleanup(done){
    events.emit('log','Cleaning up')

    listFiles(tmpDir,baseName,function(err,files){
      if(err) return done(err)
      //delete files
      deleteFiles(files,done)
    })


  }

  function deleteFiles(files,done){
    async.each(files,deleteFile,done)
  }

  function deleteFile(file,done){
    events.emit('log',`Deleting ${file}`)
    fs.unlink(path.join(tmpDir,file),function(err){
      //ignoro error
      done()
    })
  }

  function convertFinishing(err){
    // setTimeout(function(){
    //   events.emit('video','this will be the encoded video')
    // },1000)

    if(err) return events.emit('error',err)

    events.emit('video',video)
  }
  return events

}
