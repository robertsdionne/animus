// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('animus.Character');


animus.Character = function(object) {
  goog.base(this, object.id);
  this.skeletonId_ = object.skeletonId;
  this.meshId_ = object.meshId;
  this.clipId_ = object.clipId;
};
goog.inherits(animus.Character, animus.Asset);


animus.Character.prototype = {
  skeletonId: function() {
    return this.skeletonId_;
  },
  meshId: function() {
    return this.meshId_;
  },
  clipId: function() {
    return this.clipId_;
  }
};
