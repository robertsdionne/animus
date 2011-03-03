// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */


/**
 * @constructor
 */
animus.BoxMan = function() {
  this.data_ = [];
};


animus.BoxMan.prototype.add = function(width, height, length) {
  var halfWidth = width / 2;
  var halfLength = length / 2;
  this.addCube_(
      new animus.Vector(halfWidth, height, -halfLength),
      new animus.Vector(halfWidth, height, halfLength),
      new animus.Vector(-halfWidth, height, halfLength),
      new animus.Vector(-halfWidth, height, -halfLength),
      new animus.Vector(halfWidth, 0, -halfLength),
      new animus.Vector(halfWidth, 0, halfLength),
      new animus.Vector(-halfWidth, 0, halfLength),
      new animus.Vector(-halfWidth, 0, -halfLength)
  );
  return this;
};


animus.BoxMan.prototype.addCube_ = function(a, b, c, d, e, f, g, h) {
  this.addFace_(a, b, c, d);
  this.addFace_(e, h, g, f);
  this.addFace_(e, a, d, h);
  this.addFace_(g, c, b, f);
  this.addFace_(h, d, c, g);
  this.addFace_(f, b, a, e);
};


animus.BoxMan.prototype.addFace_ = function(a, b, c, d) {
  this.addTriangle_(a, b, c);
  this.addTriangle_(d, a, c);
};


animus.BoxMan.prototype.addTriangle_ = function(a, b, c) {
  //var normal = a.cross(b).normalized();
  this.data_.push(a.x(), a.y(), a.z());
  this.data_.push(1, 1, 1);
  this.data_.push(b.x(), b.y(), b.z());
  this.data_.push(1, 1, 1);
  this.data_.push(c.x(), c.y(), c.z());
  this.data_.push(1, 1, 1);
};


animus.BoxMan.prototype.build = function() {
  return new Float32Array(this.data_);
};
