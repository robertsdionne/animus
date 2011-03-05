// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

/**
 * @param {Window} window The window.
 * @param {webapp.Renderer} renderer The WebGL renderer.
 * @constructor
 */
webgl.App = function(window, renderer) {
  this.window_ = window;
  this.renderer_ = renderer;
  this.uninstall();
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
  if (this.width_ !== this.canvas_.width ||
      this.height_ !== this.canvas_.height) {
    this.width_ = this.canvas_.width;
    this.height_ = this.canvas_.height;
    this.renderer_.onChange(this.gl_, this.width_, this.height_);
  }
};


/**
 * Associates this App with the given canvas
 * and starts the rendering loop.
 * @param {Element} canvas The canvas.
 * @param {Element} opt_stats The stats indicator div.
 */
webgl.App.prototype.install = function(canvas, opt_stats) {
  this.canvas_ = canvas;
  this.gl_ = this.canvas_.getContext(webgl.App.WEBGL_CONTEXT);
  this.renderer_.onCreate(this.gl_);
  if (opt_stats) {
    this.smoothDt_ = 0;
    this.stats_ = opt_stats;
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
  this.renderer_.onDraw(this.gl_);
  if (this.stats_) {
    var tick = new Date().getTime();
    var dt = (tick - this.lastTick_) || 1;
    this.smoothDt_ = this.smooth(dt, this.smoothDt_, webgl.App.SMOOTH);
    this.stats_.innerText = this.round(this.smoothDt_) + ' ms ';
    this.lastTick_ = tick;
  }
  animus.global.requestAnimationFrame(
      animus.bind(this.onFrame_, this),
      this.canvas_);
};


/**
 * Dissociates this App with the previously associated canvas
 * and stops the rendering loop.
 */
webgl.App.prototype.uninstall = function() {
  this.renderer_.onDestroy(this.gl_);
  this.width_ = this.height_ = 0;
  this.canvas_ = null;
  this.gl_ = null;
};
