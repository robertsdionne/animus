// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('webgl.Renderer');


/**
 * A WebGL renderer.
 * @interface
 */
webgl.Renderer = function() {};


webgl.Renderer.prototype = {
  /**
   * Handles changes in WebGL canvas size.
   * @param {WebGLRenderingContext} gl The WebGL rendering context.
   * @param {number} width The new canvas width.
   * @param {number} height Thew new canvas height.
   */
  onChange: goog.abstractMethod,


  /**
   * Handles WebGL context creation.
   * @param {WebGLRenderingContext} gl The WebGL rendering context.
   */
  onCreate: goog.abstractMethod,


  /**
   * Handles WebGL context destruction.
   * @param {WebGLRenderingContext} gl The WebGL rendering context.
   */
  onDestroy: goog.abstractMethod,


  /**
   * Handles WebGL drawing.
   * @param {WebGLRenderingContext} gl The WebGL rendering context.
   */
  onDraw: goog.abstractMethod
};
