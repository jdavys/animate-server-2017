'use strict'

const http = require('http');

// var de entorno
const port = process.env.PORT || 8080
const fs = require('fs')
//manejo de rutas
const path = require('path');

//crear un servidor web HTTP
const server = http.createServer();

//eventos eventemitter
server.on('request',onRequest);
server.on('listening',onListening);

server.listen(port)

function onRequest(req,res){
  let uri=req.url;
  if(uri.startsWith('/index') || uri ==='/'){
    return serverIndex(res);
  }

  if( uri==='/app.js'){
    return serverApp(res);
  }
  res.statusCode=404
  res.end(`404 not found ${uri}`)
  //res.end("Hola io.js");
  //let file = fs.readFileSync('public/index.html');
  //asincrono join concatenar rutas y dire
  //let index= path.join(__dirname,'public','index.html');

  //res.setHeader('content-Type', 'text/html');
  //crear streams mecamismos leer archivos binario
  //let rs=fs.createReadStream(index) //lectura

  //eventemitter streams no es recomendado
  /*rs.on('data',function(chunk){

  })*/

  //pipe request stream de lect, respo stream escritura
  /*rs.pipe(res)

  rs.on('error',function(err){
    res.end(err.message)
  })*/
  /*fs.readFile(index,function(err,file){
    if(err) return res.end(err.message);

    //definir la cabecera
    res.setHeader('content-Type', 'text/html');
    res.end(file)
  });*/

}

function serverIndex(res){
  let index= path.join(__dirname,'public','index.html')
  res.setHeader('content-Type', 'text/html')
  let rs=fs.createReadStream(index)
  rs.pipe(res)

  rs.on('error',function(err){
    res.setHeader('content-Type', 'text/plain')
    res.end(err.message)
  })
}

function serverApp(res){
  let app= path.join(__dirname,'public','app.js')
  res.setHeader('content-Type', 'text/javascript')
  let rs=fs.createReadStream(app)
  rs.pipe(res)

  rs.on('error',function(err){
    res.setHeader('content-Type', 'text/plain')
    res.end(err.message)
  })
}
function onListening(){
  console.log(`Servidor escuchando en el port ${port}` )
}
