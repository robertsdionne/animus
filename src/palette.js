// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @constructor
 */
animus.Palette = function() {
  /**
   * @type {Array.<animus.DualQuaternion>}
   * @private
   */
  this.palette_ = [];
};


/**
 * @param {number} i
 * @param {animus.DualQuaternion} joint
 */
animus.Palette.prototype.set = function(i, joint) {
  this.palette_[i] = joint;
};


animus.Palette.prototype.reset = function() {
  this.palette_ = [];
};


/**
 * @return {Array.<number>}
 */
animus.Palette.prototype.get = function() {
  var result = [];
  for (var i = 0; i < this.palette_.length; ++i) {
    var joint = this.palette_[i];
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
