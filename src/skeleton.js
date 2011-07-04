// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @param {Array.<animus.Bone>} joints
 * @param {!animus.Pose} bindingPose
 */
animus.Skeleton = function(joints, bindPose) {
  this.joints = joints;
  this.bindPose = bindPose;
};
