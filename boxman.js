// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */


/**
 * @constructor
 */
animus.BoxMan = function() {
  this.data_ = [];
};


animus.BoxMan.prototype.add = function(i, transform, width, height, length) {
  transform = transform || new animus.DualQuaternion();
  var halfWidth = width / 2;
  var halfLength = length / 2;
  this.addCube_(i, transform,
      new animus.Vector(halfWidth, height, halfLength),
      new animus.Vector(halfWidth, height, -halfLength),
      new animus.Vector(-halfWidth, height, -halfLength),
      new animus.Vector(-halfWidth, height, halfLength),
      new animus.Vector(halfWidth, 0, halfLength),
      new animus.Vector(halfWidth, 0, -halfLength),
      new animus.Vector(-halfWidth, 0, -halfLength),
      new animus.Vector(-halfWidth, 0, halfLength)
  );
  return this;
};


animus.BoxMan.prototype.addCube_ =
    function(i, transform, a, b, c, d, e, f, g, h) {
  this.addFace_(i, transform, a, b, c, d);
  this.addFace_(i, transform, e, h, g, f);
  this.addFace_(i, transform, e, a, d, h);
  this.addFace_(i, transform, g, c, b, f);
  this.addFace_(i, transform, h, d, c, g);
  this.addFace_(i, transform, f, b, a, e);
};


animus.BoxMan.prototype.addFace_ = function(i, transform, a, b, c, d) {
  this.addTriangle_(i, transform, a, b, c);
  this.addTriangle_(i, transform, c, d, a);
};


animus.BoxMan.prototype.addTriangle_ = function(i, transform, a, b, c) {
  a = transform.transform(a);
  b = transform.transform(b);
  c = transform.transform(c);
  var normal = c.minus(b).cross(a.minus(b)).normalized();
  this.data_.push(a.x, a.y, a.z);
  this.data_.push(normal.x, normal.y, normal.z);
  this.data_.push(1, 1, 1);
  this.data_.push(i);
  this.data_.push(b.x, b.y, b.z);
  this.data_.push(normal.x, normal.y, normal.z);
  this.data_.push(1, 1, 1);
  this.data_.push(i);
  this.data_.push(c.x, c.y, c.z);
  this.data_.push(normal.x, normal.y, normal.z);
  this.data_.push(1, 1, 1);
  this.data_.push(i);
};


animus.BoxMan.prototype.build = function() {
  return new Float32Array(this.data_);
};
