// Copyright 2011 Robert Scott Dionne. All rights reserved.

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
  this.scalar = typeof scalar === "undefined" ?
      new animus.DualNumber(1) : scalar;
};


animus.DualQuaternion.fromPosition = function(position) {
  return new animus.DualQuaternion(
      new animus.DualVector(
          new animus.DualNumber(0, position.x),
          new animus.DualNumber(0, position.y),
          new animus.DualNumber(0, position.z)),
      new animus.DualNumber(1));
};


animus.DualQuaternion.fromTranslation = function(translation) {
  return new animus.DualQuaternion(
      new animus.DualVector(
          new animus.DualNumber(0, translation.x / 2),
          new animus.DualNumber(0, translation.y / 2),
          new animus.DualNumber(0, translation.z / 2)),
      new animus.DualNumber(1));
};


animus.DualQuaternion.fromRotation = function(rotation) {
  return new animus.DualQuaternion(
      rotation.vector.toDual(),
      new animus.DualNumber(rotation.scalar));
};


animus.DualQuaternion.fromAxisAngle = function(axis, angle) {
  return new animus.DualQuaternion(
      axis.normalized().times(Math.sin(angle/2)).toDual(),
      new animus.DualNumber(Math.cos(angle/2)));
};


animus.DualQuaternion.prototype.real = function() {
  return new animus.Quaternion(this.vector.real(), this.scalar.real);
};


animus.DualQuaternion.prototype.dual = function() {
  return new animus.Quaternion(this.vector.dual(), this.scalar.dual);
};


/**
 * @param {animus.DualQuaternion} that
 * @param {number} t
 * @return {animus.DualQuaternion}
 */
animus.DualQuaternion.prototype.lerp = function(that, t) {
  var v = new animus.DualNumber(t);
  var u = new animus.DualNumber(1).minus(v);
  return this.times(u).plus(that.times(v)).normalized();
};


/**
 * @return {animus.DualQuaternion} The negation of this quaternion.
 */
animus.DualQuaternion.prototype.negate = function() {
  return new animus.DualQuaternion(this.vector.negate(), this.scalar.negate());
};


/**
 * @return {number} The magnitude of this quaternion.
 */
animus.DualQuaternion.prototype.magnitude = function() {
  return this.magnitudeSquared().sqrt();
};


/**
 * @return {number} The square magnitude of this quaternion.
 */
animus.DualQuaternion.prototype.magnitudeSquared = function() {
  return this.scalar.times(this.scalar).plus(this.vector.magnitudeSquared());
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


animus.DualQuaternion.prototype.dualConjugate = function() {
  return new animus.DualQuaternion(
      this.vector.dualConjugate(), this.scalar.dualConjugate());
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
  if (that instanceof animus.DualNumber) {
    return new animus.DualQuaternion(this.vector, this.scalar.plus(that));
  } else if (that instanceof animus.DualQuaternion) {
    return new animus.DualQuaternion(
        this.vector.plus(that.vector),
        this.scalar.plus(that.scalar));
  }
};


/**
 * @return {animus.DualQuaternion} The difference of this and that.
 * @param {number|animus.DualQuaternion} that
 */
animus.DualQuaternion.prototype.minus = function(that) {
  if (that instanceof animus.DualNumber) {
    return new animus.DualQuaternion(this.vector, this.scalar.minus(that));
  } else if (that instanceof animus.DualQuaternion) {
    return new animus.DualQuaternion(
        this.vector.minus(that.vector),
        this.scalar.minus(that.scalar));
  }
};


/**
 * @return {animus.DualQuaternion} The product of this and that.
 * @param {number|animus.DualQuaternion} that
 */
animus.DualQuaternion.prototype.times = function(that) {
  if (that instanceof animus.DualNumber) {
    return new animus.DualQuaternion(
        this.vector.times(that),
        this.scalar.times(that));
  } else if (that instanceof animus.DualQuaternion) {
    return new animus.DualQuaternion(
        that.vector.times(this.scalar).
            plus(this.vector.times(that.scalar)).
            plus(this.vector.cross(that.vector)),
        this.scalar.times(that.scalar).minus(this.vector.dot(that.vector)));
  } else if (that instanceof animus.Pose) {
    var result = new animus.Pose();
    for (var i = 0; i < that.bones_.length; ++i) {
      result.set(i, this.times(that.bones_[i]));
    }
    return result;
  }
};


/**
 * @return {animus.DualQuaternion} The quotient of this and that.
 * @param {number|animus.DualQuaternion} that
 */
animus.DualQuaternion.prototype.over = function(that) {
  if (that instanceof animus.DualNumber) {
    return new animus.DualQuaternion(
        this.vector.over(that),
        this.scalar.over(that));
  } else if (that instanceof animus.DualQuaternion) {
    return this.times(that.reciprocal());
  }
};

/**
 * @return {animus.Vector} That vector rotated by this quaternion.
 * @param {animus.Vector} that
 */
animus.DualQuaternion.prototype.transform = function(that) {
  return this.times(animus.DualQuaternion.fromPosition(that)).
      times(this.dualConjugate().reciprocal()).vector.dual();
};


/**
 * @return {string} A string representation of this quaternion.
 */
animus.DualQuaternion.prototype.toString = function() {
  return this.vector + ' + ' + this.scalar;
};
