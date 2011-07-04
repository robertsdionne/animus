// Copyright 2011 Robert Scott Dionne. All rights reserved.

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
 * @extends {animus.Quaternion}
 */
animus.Vector = function(x, y, z) {
  this.scalar = 0;
  this.vector = this;
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
};
animus.inherits(animus.Vector, animus.Quaternion);


animus.Vector.I = new animus.Vector(1, 0, 0);


animus.Vector.J = new animus.Vector(0, 1, 0);


animus.Vector.K = new animus.Vector(0, 0, 1);


/**
 * @return {animus.Vector} The negation of this vector.
 */
animus.Vector.prototype.negate = function() {
  return new animus.Vector(-this.x, -this.y, -this.z);
};


animus.Vector.prototype.toDual = function() {
  return new animus.DualVector(
      new animus.DualNumber(this.x),
      new animus.DualNumber(this.y),
      new animus.DualNumber(this.z));
};


/**
 * @return {number} The square magnitude of this vector.
 */
animus.Vector.prototype.magnitudeSquared = function() {
  return this.dot(this);
};


/**
 * @return {animus.Vector|animus.Quaternion} The sum of this and that.
 * @param {animus.Vector|number|animus.Quaternion} that
 */
animus.Vector.prototype.plus = function(that) {
  if (that instanceof animus.Vector) {
    return new animus.Vector(
        this.x + that.x,
        this.y + that.y,
        this.z + that.z);
  } else {
    return animus.Quaternion.prototype.plus.call(this, that);
  }
};


/**
 * @return {animus.Vector|animus.Quaternion} The difference of this and that.
 * @param {animus.Vector|number|animus.Quaternion} that
 */
animus.Vector.prototype.minus = function(that) {
  if (that instanceof animus.Vector) {
    return new animus.Vector(
        this.x - that.x,
        this.y - that.y,
        this.z - that.z);
  } else {
    return animus.Quaternion.prototype.plus.call(this, that);
  }
};


/**
 * @return {animus.Vector|animus.Quaternion} The product of this and that.
 * @param {number|animus.Quaternion} that
 */
animus.Vector.prototype.times = function(that) {
  if (typeof that === 'number') {
    return new animus.Vector(this.x * that, this.y * that, this.z * that);
  } else {
    return animus.Quaternion.prototype.times.call(this, that);
  }
};


/**
 * @return {animus.Vector|animus.Quaternion} The quotient of this and that.
 * @param {number|animus.Quaternion} that
 */
animus.Vector.prototype.over = function(that) {
  if (typeof that === 'number') {
    return new animus.Vector(this.x / that, this.y / that, this.z / that);
  } else {
    return animus.Quaternion.prototype.over.call(this, that);
  }
};


/**
 * @return {animus.Vector} The cross product of this and that.
 * @param {animus.Vector} that
 */
animus.Vector.prototype.cross = function(that) {
  return new animus.Vector(
      this.y * that.z - this.z * that.y,
      this.z * that.x - this.x * that.z,
      this.x * that.y - this.y * that.x);
};


/**
 * @return {number} The dot product of this and that.
 * @param {animus.Vector} that
 */
animus.Vector.prototype.dot = function(that) {
  return this.x * that.x + this.y * that.y + this.z * that.z;
};


/**
 * @return {string} A string representation of this vector.
 */
animus.Vector.prototype.toString = function() {
  return this.x + 'i + ' + this.y + 'j + ' + this.z + 'k';
};
