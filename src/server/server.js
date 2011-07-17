// Copyright 2011 Robert Scott Dionne. All rights reserved.

var express = require('express');
var http = require('http');


var app = express.createServer();

app.use(express.favicon('favicon.ico'));
app.use(express.static('src'));

app.get('/', function(request, response) {
  response.sendfile('src/animus.html');
});

app.listen(8888);
