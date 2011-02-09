// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('animus.Character');

goog.require('animus.Asset');


animus.Character = function(object) {
  goog.base(this, object.id);
  this.skeletonId_ = object.skeletonId;
  this.meshId_ = object.meshId;
  this.clipId_ = object.clipId;
};
goog.inherits(animus.Character, animus.Asset);


animus.Character.ASSET_ID_PROPERTY_MASK = {
  id: {}, skeletonId: {}, meshId: {}, clipId: {}
};


animus.Character.prototype.skeletonId = function() {
  return this.skeletonId_;
};


animus.Character.prototype.meshId = function() {
  return this.meshId_;
};


animus.Character.prototype.clipId = function() {
  return this.clipId_;
};
