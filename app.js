// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

/**
 * @param {Window} window The window.
 * @constructor
 */
webgl.App = function(window, keys) {
  this.window_ = window;
  this.keys_ = keys;
  this.reset();
};


/**
 * WebGL context identifier.
 * @type {string}
 */
webgl.App.WEBGL_CONTEXT = 'experimental-webgl';


/**
 * Checks that the dimensions and, if so, dispatches onChange
 * to the Renderer.
 * @private
 */
webgl.App.prototype.checkDimensions_ = function() {
  for (var id in this.gls_) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    if (this.widths_[id] !== width ||
        this.heights_[id] !== height) {
      this.canvases_[id].width = width;
      this.canvases_[id].height = height;
      this.widths_[id] = width;
      this.heights_[id] = height;
      this.renderers_[id].onChange(this.gls_[id], width, height);
    }
  }
};


/**
 * Associates this App with the given canvas
 * and starts the rendering loop.
 * @param {Object.<String, webgl.Renderer>} renderers The renderers.
 */
webgl.App.prototype.install = function(renderers, opt_stats) {
  for (var id in renderers) {
    this.canvases_[id] = animus.global.document.getElementById(id);
    this.canvases_[id].width = window.innerWidth;
    this.canvases_[id].height = window.innerHeight;
    this.gls_[id] = this.canvases_[id].getContext(webgl.App.WEBGL_CONTEXT);
    this.renderers_[id] = renderers[id];
    this.renderers_[id].onCreate(this.gls_[id]);
  }
  if (opt_stats) {
    this.smoothDt_ = 0;
    this.stats_ = animus.global.document.getElementById(opt_stats);
    this.lastTick_ = new Date().getTime();
  }
  this.onFrame_();
};


webgl.App.SMOOTH = 0.25;


webgl.App.prototype.smooth = function(sample, average, rate) {
  return rate * sample + (1 - rate) * average;
};


webgl.App.prototype.round = function(sample) {
  return Math.round(10 * sample) / 10;
};


/**
 * Dispatches onChange and onDraw events to the Renderer.
 * @private
 */
webgl.App.prototype.onFrame_ = function() {
  this.checkDimensions_();
  if (this.stats_ ) {
    var tick = new Date().getTime();
    var dt = (tick - this.lastTick_) || 1;
    this.smoothDt_ = this.smooth(dt, this.smoothDt_, webgl.App.SMOOTH);
    this.stats_.innerText = this.round(this.smoothDt_) + ' ms';
    this.lastTick_ = tick;
  }
  for (var id in this.gls_) {
    this.renderers_[id].onDraw(this.gls_[id]);
  }
  this.keys_.update();
  animus.global.setTimeout(
      animus.bind(this.onFrame_, this), 1000/60);
};


/**
 * Dissociates this App with the previously associated canvas
 * and stops the rendering loop.
 */
webgl.App.prototype.uninstall = function() {
  for (var id in this.gls_) {
    this.renderers_[id].onDestroy(this.gls_[id]);
  }
  this.reset();
};


webgl.App.prototype.reset = function() {
  this.canvases_ = {};
  this.gls_ = {};
  this.renderers_ = {};
  this.widths_ = {};
  this.heights_ = {};
};
