// Copyright 2011 Robert Scott Dionne. All rights reserved.

var express = require('express');
var http = require('http');


var app = express.createServer();

app.use(express.favicon('favicon.ico'));

app.get('/', function(request, response) {
  response.sendfile('animus.html');
});

app.get('/src/*', function(request, response) {
  response.sendfile('src/' + request.params[0]);
});

app.listen(8888);
