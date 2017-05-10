'use strict'

const http = require('http');
// var de entorno
const port = process.env.PORT || 8080
//crear un servidor web HTTP

const server = http.createServer();

server.listen(port);
