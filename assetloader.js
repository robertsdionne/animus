// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('animus.AssetLoader');

goog.require('animus.AssetManager');
goog.require('animus.Character');

goog.require('goog.structs.Map');


animus.AssetLoader = function() {
};
goog.addSingletonGetter(animus.AssetLoader);


animus.AssetLoader.prototype.loadAssets = function(json) {
  var result = JSON.parse(json);
  var idMap = new goog.structs.Map();
  for (var i = 0; i < result.character.length; ++i) {
    this.loadAsset_(animus.Character, result.character[i], idMap);
  }
};


animus.AssetLoader.prototype.loadAsset_ = function(assetCtor, object, idMap) {
  var translated =
      this.translateIdsInObject_(object, assetCtor.LOAD_MASK, idMap);
  var asset = new assetCtor(translated);
  animus.AssetManager.getInstance().putAsset(asset);
};


animus.AssetLoader.prototype.translateIdsInObject_ =
    function(object, mask, idMap) {
  var translated = {};
  for (var property in mask) {
    if (object[property].length) {
      translated[property] =
          this.translateIdsInArray_(object[property], idMap);
    } else {
      translated[property] = this.translateId_(object[property], idMap);
    }
  }
  return translated;
};


animus.AssetLoader.prototype.translateIdsInArray_ = function(array, idMap) {
  var translated = [];
  for (var i = 0; i < array.length; ++i) {
    translated[i] = this.translateId_(array[i], idMap);
  }
  return translated;
};


animus.AssetLoader.prototype.translateId_ = function(id, idMap) {
  if (idMap.containsKey(id)) {
    return idMap.get(id);
  } else {
    var newId = animus.AssetManager.getInstance().reserveId();
    idMap.set(id, newId);
    return newId;
  }
};
