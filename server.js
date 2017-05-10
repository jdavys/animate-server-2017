'use strict'

const http = require('http');

// var de entorno
const port = process.env.PORT || 8080

//crear un servidor web HTTP
const server = http.createServer();

//eventos eventemitter
server.on('request',onRequest);
server.on('listening',onListening);

server.listen(port)

function onRequest(req,res){
  res.end("Hola io.js");
}

function onListening(){
  console.log("Servidor escuchando en el port "+ port);
}
