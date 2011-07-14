// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 */
animus.Animator = function() {};


/**
 * @param {!animus.Skeleton} skeleton
 * @param {!animus.DualQuaternion} root
 * @param {!animus.Pose} first
 * @param {!animus.Pose} second
 * @return {!animus.Palette}
 */
animus.Animator.prototype.animate = function(skeleton, root, first, second, t) {
  return root.times(first.blend(second, t).
      globalize(skeleton).times(skeleton.globalBindPose.inverse())).get();
};
