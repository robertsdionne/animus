// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 */
animus.Palette = function() {
  /**
   * @type {Array.<animus.DualQuaternion>}
   * @private
   */
  this.joints_ = [];
};


/**
 * @return {animus.Palette}
 */
animus.Palette.prototype.inverse = function() {
  var result = new animus.Palette();
  for (var i = 0; i < this.joints_.length; ++i) {
    result.set(i, this.joints_[i].reciprocal());
  }
  return result;
};


/**
 * @param {animus.Palette} that
 * @return {animus.Palette}
 */
animus.Palette.prototype.times = function(that) {
  var result = new animus.Palette();
  for (var i = 0; i < this.joints_.length; ++i) {
    result.set(i, this.joints_[i].times(that.joints_[i]));
  }
  return result;
};


/**
 * @param {number} i
 * @param {animus.DualQuaternion} joint
 */
animus.Palette.prototype.set = function(i, joint) {
  this.joints_[i] = joint;
};


animus.Palette.prototype.reset = function() {
  this.joints_ = [];
};


/**
 * @return {animus.DualQuaternion}
 */
animus.Palette.prototype.getJoint = function(i) {
  return this.joints_[i];
};


/**
 * @return {Array.<number>}
 */
animus.Palette.prototype.get = function() {
  var result = [];
  for (var i = 0; i < this.joints_.length; ++i) {
    var joint = this.joints_[i];
    result.push(
        joint.vector.x.real,
        joint.vector.y.real,
        joint.vector.z.real,
        joint.scalar.real,
        joint.vector.x.dual,
        joint.vector.y.dual,
        joint.vector.z.dual,
        joint.scalar.dual);
  }
  return result;
};
