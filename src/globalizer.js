// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 */
animus.Globalizer = function() {};


/**
 * @param {!animus.Pose}
 * @return {!animus.Pose}
 */
animus.Globalizer.prototype.globalize = function(skeleton, pose) {
  /** @type {animus.Pose} */
  var result = [];
  for (var thisBone = 0; thisBone < skeleton.joints.length; ++thisBone) {
    var thatBone = thisBone;
    result[thisBone] = pose[thatBone];
    while (thatBone = skeleton.joints[thatBone]) {
      result[thisBone] = pose[thatBone].times(result[thisBone]);
    }
  }
  return result;
};
