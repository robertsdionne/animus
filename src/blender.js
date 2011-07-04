// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 */
animus.Blender = function() {};


/**
 * @param {!animus.Pose} first
 * @param {!animus.Pose} second
 * @return {!animus.Pose}
 */
animus.Blender.prototype.blend = function(first, second, t) {
  /** @type {animus.Pose} */
  var result = {};
  for (var bone in first) {
    result[bone] = first[bone].lerp(second[bone], t);
  }
  return result;
};
