// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @param {Array.<animus.Bone>} joints
 * @param {!animus.Pose} bindPose
 */
animus.Skeleton = function(joints, bindPose) {
  this.joints = joints;
  this.globalBindPose = bindPose.globalize(this);
};
