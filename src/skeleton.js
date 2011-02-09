// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('animus.Skeleton');

goog.require('animus.Asset');


animus.Skeleton = function(object) {
  goog.base(this, object.id);
  this.joint_ = object.joint;
};
goog.inherits(animus.Skeleton, animus.Asset);


animus.Skeleton.ASSET_ID_PROPERTY_MASK = {
  id: {}
};


animus.Skeleton.prototype.joint = function() {
  return this.joint_;
};
