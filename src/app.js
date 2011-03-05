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
 */
webgl.App.prototype.install = function(canvas) {
  this.canvas_ = canvas;
  this.gl_ = this.canvas_.getContext(webgl.App.WEBGL_CONTEXT);
  this.renderer_.onCreate(this.gl_);
  this.onFrame_();
};


/**
 * Dispatches onChange and onDraw events to the Renderer.
 * @private
 */
webgl.App.prototype.onFrame_ = function() {
  this.checkDimensions_();
  this.renderer_.onDraw(this.gl_);
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
