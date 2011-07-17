// Copyright 2011 Robert Scott Dionne. All rights reserved.

var express = require('express');
var http = require('http');


var app = express.createServer();
app.get('/', function(request, response) {
  response.redirect('http://www.google.com/');
});
app.listen(8888);
