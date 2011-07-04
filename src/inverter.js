// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 */
animus.Inverter = function() {};


/**
 * @param {!animus.Pose} pose
 */
animus.Inverter.prototype.invert = function(pose) {
  /** @type {animus.Pose} */
  var result = {};
  for (var bone in pose) {
    result[bone] = pose[bone].reciprocal();
  }
  return result;
};
