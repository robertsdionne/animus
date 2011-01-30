// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('animus.Clip');

goog.require('animus.Asset');


animus.Clip = function(object) {
  goog.base(this, object.id);
  this.duration_ = object.duration;
  this.poseSample_ = object.poseSample;
  this.poseStartTime_ = object.poseStartTime;
};
goog.inherits(animus.Clip, animus.Asset);


animus.Clip.ASSET_ID_PROPERTY_MASK = {
  id: {}
};


animus.Clip.prototype.duration = function() {
  return this.duration_;
};


animus.Clip.prototype.poseSample = function() {
  return this.poseSample_;
};


animus.Clip.prototype.poseStartTime = function() {
  return this.poseStartTime_;
};
