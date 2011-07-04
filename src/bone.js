// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @param {animus.Bone.Id} id
 * @param {animus.Bone.Id} opt_parent
 */
animus.Bone = function(id, opt_parent) {
  this.id = id;
  this.parent = opt_parent || null;
};


/**
 * @typedef {(number|string)}
 */
animus.Bone.Id;
