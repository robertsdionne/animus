// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @fileoverview Defines the quaternion object.
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

/**
 * Constructs a new quaternion given the vector and scalar.
 * @param {animus.Vector} vector
 * @param {number} scalar
 * @constructor
 */
animus.Quaternion = function(vector, scalar) {
  /**
   * @type {animus.Vector}
   * @private
   */
  this.vector = vector || new animus.Vector();
  
  /**
   * @type {number}
   * @private
   */
  this.scalar = typeof scalar === "undefined" ? 1 : scalar;
};


animus.Quaternion.fromAxisAngle = function(axis, angle) {
  return new animus.Quaternion(
      axis.normalized().times(Math.sin(angle/2)),
      Math.cos(angle/2));
};


/**
 * @return {animus.Quaternion} The negation of this quaternion.
 */
animus.Quaternion.prototype.negate = function() {
  return new animus.Quaternion(this.vector.negate(), -this.scalar);
};


/**
 * @return {number} The magnitude of this quaternion.
 */
animus.Quaternion.prototype.magnitude = function() {
  return Math.sqrt(this.magnitudeSquared());
};


/**
 * @return {number} The square magnitude of this quaternion.
 */
animus.Quaternion.prototype.magnitudeSquared = function() {
  return this.scalar * this.scalar + this.vector.magnitudeSquared();
};


/**
 * @return {animus.Quaternion} This quaternion normalized.
 */
animus.Quaternion.prototype.normalized = function() {
  return this.over(this.magnitude());
};


/**
 * @return {animus.Quaternion} This quaternion's conjugate.
 */
animus.Quaternion.prototype.conjugate = function() {
  return new animus.Quaternion(this.vector.negate(), this.scalar);
};


/**
 * @return {animus.Quaternion} This quaternion's reciprocal.
 */
animus.Quaternion.prototype.reciprocal = function() {
  return this.conjugate().over(this.magnitudeSquared());
};


/**
 * @return {animus.Quaternion} The sum of this and that.
 * @param {number|animus.Quaternion} that
 */
animus.Quaternion.prototype.plus = function(that) {
  if (typeof that === 'number') {
    return new animus.Quaternion(this.vector, this.scalar + that);
  } else if (that instanceof animus.Quaternion) {
    return new animus.Quaternion(
        this.vector.plus(that.vector),
        this.scalar + that.scalar);
  }
};


/**
 * @return {animus.Quaternion} The difference of this and that.
 * @param {number|animus.Quaternion} that
 */
animus.Quaternion.prototype.minus = function(that) {
  if (typeof that === 'number') {
    return new animus.Quaternion(this.vector, this.scalar - that);
  } else if (that instanceof animus.Quaternion) {
    return new animus.Quaternion(
        this.vector.minus(that.vector),
        this.scalar - that.scalar);
  }
};


/**
 * @return {animus.Quaternion} The product of this and that.
 * @param {number|animus.Quaternion} that
 */
animus.Quaternion.prototype.times = function(that) {
  if (typeof that === 'number') {
    return new animus.Quaternion(
        this.vector.times(that),
        this.scalar * that);
  } else if (that instanceof animus.Quaternion) {
    return new animus.Quaternion(
        that.vector.times(this.scalar).
            plus(this.vector.times(that.scalar)).
            plus(this.vector.cross(that.vector)),
        this.scalar * that.scalar - this.vector.dot(that.vector));
  }
};


/**
 * @return {animus.Quaternion} The quotient of this and that.
 * @param {number|animus.Quaternion} that
 */
animus.Quaternion.prototype.over = function(that) {
  if (typeof that === 'number') {
    return new animus.Quaternion(
        this.vector.over(that),
        this.scalar / that);
  } else if (that instanceof animus.Quaternion) {
    return this.times(that.reciprocal());
  }
};

/**
 * @return {animus.Vector} That vector rotated by this quaternion.
 * @param {animus.Vector} that
 */
animus.Quaternion.prototype.transform = function(that) {
  return this.times(that).times(this.reciprocal()).vector;
};


/**
 * @return {string} A string representation of this quaternion.
 */
animus.Quaternion.prototype.toString = function() {
  return this.vector + ' + ' + this.scalar;
};
