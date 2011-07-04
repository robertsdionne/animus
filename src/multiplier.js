// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 */
animus.Multiplier = function() {};


/**
 * @param {!animus.Pose} first
 * @param {!animus.Pose} second
 * return {!animus.Pose}
 */
animus.Multiplier.protoype.multiply = function(first, second) {
  /** @type {animus.Pose} */
  var result = [];
  for (var bone = 0; bone < first.length; ++bone) {
    result[bone] = first[bone].times(second[bone]);
  }
  return result;
};
