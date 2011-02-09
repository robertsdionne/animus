// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('animus.AssetManager');

goog.require('animus.Asset');

goog.require('goog.structs.Map');


animus.AssetManager = function() {
  this.nextId_ = 0;
  this.assetMap_ = new goog.structs.Map();
};
goog.addSingletonGetter(animus.AssetManager);


/**
 * Gets an Asset from the AssetManager.
 * @param {number} id
 * @return {Asset} The requested Asset, or undefined.
 */
animus.AssetManager.prototype.getAsset = function(id) {
  return this.assetMap_.get(id);
};


animus.AssetManager.prototype.isIdReserved = function(id) {
  return this.assetMap_.containsKey(id);
};


/**
 * Puts an Asset into the AssetManager.
 * @param {animus.Asset} asset
 * @return {boolean} True if the Asset was added to the AssetManager,
 *     false otherwise.
 */
animus.AssetManager.prototype.putAsset = function(asset) {
  if (!(asset instanceof animus.Asset)) {
    return false;
  }
  if (this.assetMap_.containsKey(asset.id())) {
    return false;
  }
  this.assetMap_.set(asset.id(), asset);
};


/**
 * Reserves an id for a new Asset.
 * @return {number} The id reserved for the new Asset.
 */
animus.AssetManager.prototype.reserveId = function() {
  return this.nextId_++;
};
