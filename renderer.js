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


/**
 * Handles changes in WebGL canvas size.
 * @param {WebGLRenderingContext} gl The WebGL rendering context.
 * @param {number} width The new canvas width.
 * @param {number} height Thew new canvas height.
 */
webgl.Renderer.prototype.onChange = goog.abstractMethod;


/**
 * Handles WebGL context creation.
 * @param {WebGLRenderingContext} gl The WebGL rendering context.
 */
webgl.Renderer.prototype.onCreate = goog.abstractMethod;


/**
 * Handles WebGL context destruction.
 * @param {WebGLRenderingContext} gl The WebGL rendering context.
 */
webgl.Renderer.prototype.onDestroy = goog.abstractMethod;


/**
 * Handles WebGL drawing.
 * @param {WebGLRenderingContext} gl The WebGL rendering context.
 */
webgl.Renderer.prototype.onDraw = goog.abstractMethod;
