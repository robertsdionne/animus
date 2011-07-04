// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 */
animus.Globalizer = function() {};


/**
 * @param {!animus.Pose}
 * @return {!animus.Pose}
 */
animus.Globalizer.prototype.globalize = function(pose) {
  /** @type {animus.Pose} */
  var result = [];
  for (var thisBone in pose) {
    result[thisBone] = pose[thisBone];
    var thatBone = thisBone;
    while (thatBone = pose[thatBone]) {
      result[thisBone] = thatBone.times(result[thisBone]);
    }
  }
  return result;
};
