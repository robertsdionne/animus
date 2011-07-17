// Copyright 2011 Robert Scott Dionne. All rights reserved.

var http = require('http');


http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(8888);

console.log('Server running at http://localhost:8888/');
