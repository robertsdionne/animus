// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('animus.Mesh');

goog.require('animus.Asset');


animus.Mesh = function(object) {
  goog.base(this, object.id);
  this.vertex_ = object.vertex;
};
goog.inherits(animus.Mesh, animus.Asset);


animus.Mesh.ASSET_ID_PROPERTY_MASK = {
  id: {}
};


animus.Mesh.prototype.vertex = function() {
  return this.vertex_;
};
