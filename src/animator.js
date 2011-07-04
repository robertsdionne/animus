// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 */
animus.Animator = function() {
  this.blender = new animus.Blender();
  this.globalizer = new animus.Globalizer();
  this.inverter = new animus.Inverter();
  this.multiplier = new animus.Multiplier();
};


/**
 * @param {!animus.Skeleton} skeleton
 * @param {!animus.Pose} first
 * @param {!animus.Pose} second
 * @return {!animus.Pose}
 */
animus.Animator = function(skeleton, first, second, t) {
  var blended = this.blender.blend(first, second, t);
  var global = this.globalizer.globalize(skeleton, blended);
  var inverse = this.inverter.invert(skeleton.bindPose);
  return this.multiplier.multiply(global, inverse);
};
