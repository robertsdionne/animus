// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @param {Document} document
 * @constructor
 */
animus.Keys = function(document) {
  /**
   * @type {Document}
   */
  this.document_ = document;

  /**
   * @type {Object}
   */
  this.keys_ = {};

  /**
   * @type {Object}
   */
  this.oldKeys_ = {};
};


animus.Key = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  W: 87,
  A: 65,
  J: 74,
  K: 75,
  S: 83,
  D: 68,
  Q: 81,
  Y: 89,
  Z: 90,
  N: 78,
  P: 80,
  LT: 188,
  GT: 190
};


/**
 *
 */
animus.Keys.prototype.install = function() {
  this.document_.onkeydown = animus.bind(this.handleKeyDown_, this);
  this.document_.onkeyup = animus.bind(this.handleKeyUp_, this);
};


animus.Keys.prototype.uninstall = function() {
  this.document_.onkeydown = this.document_.onkeyup = null;
};


animus.Keys.prototype.handleKeyDown_ = function(event) {
  this.keys_[event.keyCode] = true;
  return true;
};


animus.Keys.prototype.handleKeyUp_ = function(event) {
  this.keys_[event.keyCode] = false;
  return true;
};


animus.Keys.prototype.isHeld = function(key) {
  return this.isPressed(key) && this.oldKeys_[key];
};


animus.Keys.prototype.isPressed = function(key) {
  return this.keys_[key];
};


animus.Keys.prototype.justPressed = function(key) {
  return this.isPressed(key) && !this.oldKeys_[key];
};


animus.Keys.prototype.justReleased = function(key) {
  return !this.isPressed(key) && this.oldKeys_[key];
};


animus.Keys.prototype.update = function() {
  for (var key in this.keys_) {
    this.oldKeys_[key] = this.keys_[key];
  }
};
