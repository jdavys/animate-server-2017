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
  //res.end("Hola io.js");
  //let file = fs.readFileSync('public/index.html');
  //asincrono join concatenar rutas y dire
  let fileName= path.join(__dirname,'public','index.html');
  fs.readFile(fileName,function(err,file){
    if(err){
      return res.end(err.message);
    }
    res.end(file)
  });

}

function onListening(){
  console.log("Servidor escuchando en el port "+ port);
}
