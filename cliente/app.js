const xhr = require('xhr')
const webrtc2images = require('webrtc2images')
const record = document.querySelector('#record');

const rtc = new webrtc2images({
  width: 200,
  height: 200,
  frames: 10,
  type: 'image/jpeg',
  quality: 0.4,
  interval: 200
})

rtc.startVideo(function(err){
  if (err) return logError(err)
})


record.addEventListener('click',function(e){
  e.preventDefault();

  //grabar
  rtc.recordVideo(function(err,frames){
    if (err) return logError(err)
    //console.log(frames);
    xhr({
      uri: '/process',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: frames }),
    }, function (err, res, body) {
      if (err) return logError(err)

      console.log(JSON.parse(body))
    })

    })

  },false)

function logError (err) {
  console.error(err)
}
