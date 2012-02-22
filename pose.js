// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @param {Array.<!animus.DualQuaternion>} opt_bones
 */
animus.Pose = function(opt_bones) {
  /**
   * @type {Array.<!animus.DualQuaternion>}
   * @private
   */
  this.bones_ = opt_bones || [];
};


/**
 * Blend this pose with that pose according to t.
 * @param {!animus.Pose} that
 * @param {number} t
 * return {!animus.Pose}
 */
animus.Pose.prototype.blend = function(that, t) {
  var result = new animus.Pose();
  for (var i = 0; i < this.bones_.length; ++i) {
    result.set(i, this.bones_[i].lerp(that.bones_[i], t));
  }
  return result;
};


/**
 * Globalize this pose.
 * @param {!animus.Skeleton} skeleton
 * @return {!animus.Pose}
 */
animus.Pose.prototype.globalize = function(skeleton) {
  var result = new animus.Pose();
  for (var thisBone = 0; thisBone < skeleton.joints.length; ++thisBone) {
    var thatBone = thisBone;
    result.set(thisBone, this.bones_[thatBone]);
    while ((thatBone = skeleton.joints[thatBone]) != null) {
      result.set(thisBone, this.bones_[thatBone].
          times(result.bones_[thisBone]));
    }
  }
  return result;
};


/**
 * @return {animus.Pose}
 */
animus.Pose.prototype.inverse = function() {
  var result = new animus.Pose();
  for (var i = 0; i < this.bones_.length; ++i) {
    result.set(i, this.bones_[i].reciprocal());
  }
  return result;
};


/**
 * @param {animus.Pose} that
 * @return {animus.Pose}
 */
animus.Pose.prototype.times = function(that) {
  var result = new animus.Pose();
  for (var i = 0; i < this.bones_.length; ++i) {
    result.set(i, this.bones_[i].times(that.bones_[i]));
  }
  return result;
};


/**
 * @param {number} i
 * @param {animus.DualQuaternion} bone
 */
animus.Pose.prototype.set = function(i, bone) {
  this.bones_[i] = bone;
};


animus.Pose.prototype.reset = function() {
  this.bones_ = [];
};


/**
 * @return {animus.DualQuaternion}
 */
animus.Pose.prototype.getBone = function(i) {
  return this.bones_[i];
};


/**
 * @return {!animus.Palette}
 */
animus.Pose.prototype.get = function() {
  var result = [];
  for (var i = 0; i < this.bones_.length; ++i) {
    var bone = this.bones_[i];
    result.push(
        bone.vector.x.real,
        bone.vector.y.real,
        bone.vector.z.real,
        bone.scalar.real,
        bone.vector.x.dual,
        bone.vector.y.dual,
        bone.vector.z.dual,
        bone.scalar.dual);
  }
  return result;
};
