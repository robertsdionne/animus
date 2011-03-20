// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview Defines the vector object.
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

/**
 * Constructs a new vector from the given coordinates.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @constructor
 * @extends {animus.DualQuaternion}
 */
animus.DualVector = function(x, y, z) {
  this.__defineGetter__("scalar", function() {return 0;});
  var vector = this;
  this.__defineGetter__("vector", function() {return vector;});
  var x = x || 0;
  this.__defineGetter__("x", function() {return x;});
  var y = y || 0;
  this.__defineGetter__("y", function() {return y;});
  var z = z || 0;
  this.__defineGetter__("z", function() {return z;});
};
animus.inherits(animus.DualVector, animus.DualQuaternion);


animus.DualVector.I = new animus.DualVector(1, 0, 0);


animus.DualVector.J = new animus.DualVector(0, 1, 0);


animus.DualVector.K = new animus.DualVector(0, 0, 1);


/**
 * @return {animus.DualVector} The negation of this vector.
 */
animus.DualVector.prototype.negate = function() {
  return new animus.DualVector(-this.x, -this.y, -this.z);
};


/**
 * @return {number} The square magnitude of this vector.
 */
animus.DualVector.prototype.magnitudeSquared = function() {
  return this.dot(this);
};


/**
 * @return {animus.DualVector|animus.DualQuaternion} The sum of this and that.
 * @param {animus.DualVector|number|animus.DualQuaternion} that
 */
animus.DualVector.prototype.plus = function(that) {
  if (that instanceof animus.DualVector) {
    return new animus.DualVector(
        this.x + that.x,
        this.y + that.y,
        this.z + that.z);
  } else {
    return animus.DualQuaternion.prototype.plus.call(this, that);
  }
};


/**
 * @return {animus.DualVector|animus.DualQuaternion} The difference of this and that.
 * @param {animus.DualVector|number|animus.DualQuaternion} that
 */
animus.DualVector.prototype.minus = function(that) {
  if (that instanceof animus.DualVector) {
    return new animus.DualVector(
        this.x - that.x,
        this.y - that.y,
        this.z - that.z);
  } else {
    return animus.DualQuaternion.prototype.plus.call(this, that);
  }
};


/**
 * @return {animus.DualVector|animus.DualQuaternion} The product of this and that.
 * @param {number|animus.DualQuaternion} that
 */
animus.DualVector.prototype.times = function(that) {
  if (typeof that === 'number') {
    return new animus.DualVector(this.x * that, this.y * that, this.z * that);
  } else {
    return animus.DualQuaternion.prototype.times.call(this, that);
  }
};


/**
 * @return {animus.DualVector|animus.DualQuaternion} The quotient of this and that.
 * @param {number|animus.DualQuaternion} that
 */
animus.DualVector.prototype.over = function(that) {
  if (typeof that === 'number') {
    return new animus.DualVector(this.x / that, this.y / that, this.z / that);
  } else {
    return animus.DualQuaternion.prototype.over.call(this, that);
  }
};


/**
 * @return {animus.DualVector} The cross product of this and that.
 * @param {animus.DualVector} that
 */
animus.DualVector.prototype.cross = function(that) {
  return new animus.DualVector(
      this.y * that.z - this.z * that.y,
      this.z * that.x - this.x * that.z,
      this.x * that.y - this.y * that.x);
};


/**
 * @return {number} The dot product of this and that.
 * @param {animus.DualVector} that
 */
animus.DualVector.prototype.dot = function(that) {
  return this.x * that.x + this.y * that.y + this.z * that.z;
};


/**
 * @return {string} A string representation of this vector.
 */
animus.DualVector.prototype.toString = function() {
  return this.x + 'i + ' + this.y + 'j + ' + this.z + 'k';
};
