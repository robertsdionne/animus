// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @param {Object.<animus.Bone.Id, animus.Bone>} bones
 * @param {animus.Pose} bindingPose
 */
animus.Skeleton = function(bones, bindPose) {
  this.bones = bones;
  this.bindPose = bindPose;
};
