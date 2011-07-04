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
 * @extends {animus.DualQuaternion}
 */
animus.DualVector = function(x, y, z) {
  this.scalar = new animus.DualNumber();
  this.vector = this;
  this.x = x || new animus.DualNumber();
  this.y = y || new animus.DualNumber();
  this.z = z || new animus.DualNumber();
};
animus.inherits(animus.DualVector, animus.DualQuaternion);


animus.DualVector.prototype.real = function() {
  return new animus.Vector(this.x.real, this.y.real, this.z.real);
};


animus.DualVector.prototype.dual = function() {
  return new animus.Vector(this.x.dual, this.y.dual, this.z.dual);
};


animus.DualVector.prototype.dualConjugate = function() {
  return new animus.DualVector(
      this.x.dualConjugate(),
      this.y.dualConjugate(),
      this.z.dualConjugate());
};


/**
 * @return {animus.DualVector} The negation of this vector.
 */
animus.DualVector.prototype.negate = function() {
  return new animus.DualVector(
      this.x.negate(), this.y.negate(), this.z.negate());
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
        this.x.plus(that.x), this.y.plus(that.y), this.z.plus(that.z));
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
        this.x.minus(that.x), this.y.minus(that.y), this.z.minus(that.z));
  } else {
    return animus.DualQuaternion.prototype.plus.call(this, that);
  }
};


/**
 * @return {animus.DualVector|animus.DualQuaternion} The product of this and that.
 * @param {number|animus.DualQuaternion} that
 */
animus.DualVector.prototype.times = function(that) {
  if (that instanceof animus.DualNumber) {
    return new animus.DualVector(
        this.x.times(that), this.y.times(that), this.z.times(that));
  } else {
    return animus.DualQuaternion.prototype.times.call(this, that);
  }
};


/**
 * @return {animus.DualVector|animus.DualQuaternion} The quotient of this and that.
 * @param {number|animus.DualQuaternion} that
 */
animus.DualVector.prototype.over = function(that) {
  if (that instanceof animus.DualNumber) {
    return new animus.DualVector(
        this.x.over(that), this.y.over(that), this.z.over(that));
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
      this.y.times(that.z).minus(this.z.times(that.y)),
      this.z.times(that.x).minus(this.x.times(that.z)),
      this.x.times(that.y).minus(this.y.times(that.x)));
};


/**
 * @return {number} The dot product of this and that.
 * @param {animus.DualVector} that
 */
animus.DualVector.prototype.dot = function(that) {
  return this.x.times(that.x).
      plus(this.y.times(that.y)).
      plus(this.z.times(that.z));
};


/**
 * @return {string} A string representation of this vector.
 */
animus.DualVector.prototype.toString = function() {
  return '(' + this.x + ')i + (' + this.y + ')j + (' + this.z + ')k';
};
