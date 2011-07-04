// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 */
animus.Inverter = function() {};


/**
 * @param {!animus.Pose} pose
 * @return {!animus.Pose}
 */
animus.Inverter.prototype.invert = function(pose) {
  /** @type {animus.Pose} */
  var result = [];
  for (var bone = 0; bone < pose.length; ++bone) {
    result[bone] = pose[bone].reciprocal();
  }
  return result;
};
