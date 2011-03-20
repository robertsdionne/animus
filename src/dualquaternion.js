// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview Defines the quaternion object.
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

/**
 * Constructs a new quaternion given the vector and scalar.
 * @param {animus.DualVector} vector
 * @param {number} scalar
 * @constructor
 */
animus.DualQuaternion = function(vector, scalar) {
  /**
   * @type {animus.DualVector}
   * @private
   */
  this.vector = vector || new animus.DualVector();
  
  /**
   * @type {number}
   * @private
   */
  this.scalar = typeof scalar === "undefined" ? 1 : scalar;
};


animus.DualQuaternion.fromAxisAngle = function(axis, angle) {
  return new animus.DualQuaternion(
      axis.normalized().times(Math.sin(angle/2)),
      Math.cos(angle/2));
};


/**
 * @return {animus.DualQuaternion} The negation of this quaternion.
 */
animus.DualQuaternion.prototype.negate = function() {
  return new animus.DualQuaternion(this.vector.negate(), -this.scalar);
};


/**
 * @return {number} The magnitude of this quaternion.
 */
animus.DualQuaternion.prototype.magnitude = function() {
  return Math.sqrt(this.magnitudeSquared());
};


/**
 * @return {number} The square magnitude of this quaternion.
 */
animus.DualQuaternion.prototype.magnitudeSquared = function() {
  return this.scalar * this.scalar + this.vector.magnitudeSquared();
};


/**
 * @return {animus.DualQuaternion} This quaternion normalized.
 */
animus.DualQuaternion.prototype.normalized = function() {
  return this.over(this.magnitude());
};


/**
 * @return {animus.DualQuaternion} This quaternion's conjugate.
 */
animus.DualQuaternion.prototype.conjugate = function() {
  return new animus.DualQuaternion(this.vector.negate(), this.scalar);
};


/**
 * @return {animus.DualQuaternion} This quaternion's reciprocal.
 */
animus.DualQuaternion.prototype.reciprocal = function() {
  return this.conjugate().over(this.magnitudeSquared());
};


/**
 * @return {animus.DualQuaternion} The sum of this and that.
 * @param {number|animus.DualQuaternion} that
 */
animus.DualQuaternion.prototype.plus = function(that) {
  if (typeof that === 'number') {
    return new animus.DualQuaternion(this.vector, this.scalar + that);
  } else if (that instanceof animus.DualQuaternion) {
    return new animus.DualQuaternion(
        this.vector.plus(that.vector),
        this.scalar + that.scalar);
  }
};


/**
 * @return {animus.DualQuaternion} The difference of this and that.
 * @param {number|animus.DualQuaternion} that
 */
animus.DualQuaternion.prototype.minus = function(that) {
  if (typeof that === 'number') {
    return new animus.DualQuaternion(this.vector, this.scalar - that);
  } else if (that instanceof animus.DualQuaternion) {
    return new animus.DualQuaternion(
        this.vector.minus(that.vector),
        this.scalar - that.scalar);
  }
};


/**
 * @return {animus.DualQuaternion} The product of this and that.
 * @param {number|animus.DualQuaternion} that
 */
animus.DualQuaternion.prototype.times = function(that) {
  if (typeof that === 'number') {
    return new animus.DualQuaternion(
        this.vector.times(that),
        this.scalar * that);
  } else if (that instanceof animus.DualQuaternion) {
    return new animus.DualQuaternion(
        that.vector.times(this.scalar).
            plus(this.vector.times(that.scalar)).
            plus(this.vector.cross(that.vector)),
        this.scalar * that.scalar - this.vector.dot(that.vector));
  }
};


/**
 * @return {animus.DualQuaternion} The quotient of this and that.
 * @param {number|animus.DualQuaternion} that
 */
animus.DualQuaternion.prototype.over = function(that) {
  if (typeof that === 'number') {
    return new animus.DualQuaternion(
        this.vector.over(that),
        this.scalar / that);
  } else if (that instanceof animus.DualQuaternion) {
    return this.times(that.reciprocal());
  }
};

/**
 * @return {animus.DualVector} That vector rotated by this quaternion.
 * @param {animus.DualVector} that
 */
animus.DualQuaternion.prototype.rotate = function(that) {
  return this.times(that).times(this.reciprocal()).vector;
};


/**
 * @return {string} A string representation of this quaternion.
 */
animus.DualQuaternion.prototype.toString = function() {
  return this.vector + ' + ' + this.scalar;
};
