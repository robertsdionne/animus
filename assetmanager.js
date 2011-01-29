// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('animus.AssetManager');

goog.require('goog.structs.Map');


animus.AssetManager = function() {
  this.nextId_ = 0;
  this.assetMap_ = new goog.structs.Map();
};
goog.addSingletonGetter(animus.AssetManager);


animus.AssetManager.prototype = {
  /**
   * Gets an Asset from the AssetManager.
   * @param {number} id
   * @return {Asset} The requested Asset, or undefined.
   */
  getAsset: function(id) {
    return this.assetMap_.get(id);
  },


  /**
   * Puts an Asset into the AssetManager.
   * @param {number} id
   * @param {animus.Asset} asset
   * @return {boolean} True if the Asset was added to the AssetManager,
   *     false otherwise.
   */
  putAsset: function(id, asset) {
    if (this.assetMap_.containsKey(id)) {
      return false;
    }
    if (!(asset instanceof Asset)) {
      return false;
    }
    this.assetMap_.set(id, asset);
  },


  /**
   * Reserves an id for a new Asset.
   * @return {number} The id reserved for the new Asset.
   */
  reserveId: function() {
    return this.nextId_++;
  }
};
