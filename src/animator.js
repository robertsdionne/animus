// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 */
animus.Animator = function() {};


/**
 * @param {!animus.Skeleton} skeleton
 * @param {!animus.Pose} first
 * @param {!animus.Pose} second
 * @return {!animus.Palette}
 */
animus.Animator.prototype.animate = function(skeleton, first, second, t) {
  return first.blend(second, t).
      globalize(skeleton).times(skeleton.globalBindPose.inverse()).get();
};
