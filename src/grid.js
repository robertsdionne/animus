// Copyright 2011 Robert Scott Dionne. All rights reserved.

animus.Grid = function(y, width, depth, nx, nz, triangleColor, wireframeColor) {
  this.y = y;
  this.width = width;
  this.depth = depth;
  this.nx = nx;
  this.nz = nz;
  this.triangleColor = triangleColor;
  this.wireframeColor = wireframeColor;
};


animus.Grid.prototype.getTriangleVertexCount = function() {
  return this.nx * this.nz * 6;
};


animus.Grid.prototype.buildTriangles = function() {
  var normal = [0, 1, 0];
  var data = [];
  var dx = this.width / this.nx;
  var dz = this.depth / this.nz;
  for (var i = 0; i < this.nx; ++i) {
    for (var k = 0; k < this.nz; ++k) {
      var p0 = [-this.width/2 + (i + 0) * dx, this.y,
          -this.depth/2 + (k + 0) * dz];
      var p1 = [-this.width/2 + (i + 1) * dx, this.y,
          -this.depth/2 + (k + 0) * dz];
      var p2 = [-this.width/2 + (i + 1) * dx, this.y,
          -this.depth/2 + (k + 1) * dz];
      var p3 = [-this.width/2 + (i + 0) * dx, this.y,
          -this.depth/2 + (k + 1) * dz];
      Array.prototype.push.apply(data, p0);
      Array.prototype.push.apply(data, normal);
      Array.prototype.push.apply(data, this.triangleColor);
      data.push(0);
      Array.prototype.push.apply(data, p3);
      Array.prototype.push.apply(data, normal);
      Array.prototype.push.apply(data, this.triangleColor);
      data.push(0);
      Array.prototype.push.apply(data, p1);
      Array.prototype.push.apply(data, normal);
      Array.prototype.push.apply(data, this.triangleColor);
      data.push(0);
      Array.prototype.push.apply(data, p1);
      Array.prototype.push.apply(data, normal);
      Array.prototype.push.apply(data, this.triangleColor);
      data.push(0);
      Array.prototype.push.apply(data, p3);
      Array.prototype.push.apply(data, normal);
      Array.prototype.push.apply(data, this.triangleColor);
      data.push(0);
      Array.prototype.push.apply(data, p2);
      Array.prototype.push.apply(data, normal);
      Array.prototype.push.apply(data, this.triangleColor);
      data.push(0);
    }
  }
  return new Float32Array(data);
};


animus.Grid.prototype.getWireframeVertexCount = function() {
  return this.nx * this.nz * 4;
};


animus.Grid.prototype.buildWireframe = function() {
  var normal = [0, 1, 0];
  var data = [];
  var dx = this.width / this.nx;
  var dz = this.depth / this.nz;
  for (var i = 0; i < this.nx; ++i) {
    for (var k = 0; k < this.nz; ++k) {
      var p0 = [-this.width/2 + (i + 0) * dx, this.y,
          -this.depth/2 + (k + 0) * dz];
      var p1 = [-this.width/2 + (i + 1) * dx, this.y,
          -this.depth/2 + (k + 0) * dz];
      var p2 = [-this.width/2 + (i + 1) * dx, this.y,
          -this.depth/2 + (k + 1) * dz];
      var p3 = [-this.width/2 + (i + 0) * dx, this.y,
          -this.depth/2 + (k + 1) * dz];
      Array.prototype.push.apply(data, p0);
      Array.prototype.push.apply(data, normal);
      Array.prototype.push.apply(data, this.wireframeColor);
      data.push(0);
      Array.prototype.push.apply(data, p1);
      Array.prototype.push.apply(data, normal);
      Array.prototype.push.apply(data, this.wireframeColor);
      data.push(0);
      Array.prototype.push.apply(data, p0);
      Array.prototype.push.apply(data, normal);
      Array.prototype.push.apply(data, this.wireframeColor);
      data.push(0);
      Array.prototype.push.apply(data, p3);
      Array.prototype.push.apply(data, normal);
      Array.prototype.push.apply(data, this.wireframeColor);
      data.push(0);
    }
  }
  return new Float32Array(data);
};
