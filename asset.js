// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('animus.Asset');


/**
 * @constructor
 */
animus.Asset = function(id) {
  this.id_ = id;
};


animus.Asset.prototype.id = function() {
  return this.id_;
};
