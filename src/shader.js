// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

/**
 * @constructor
 */
webgl.Shader = function(type, source) {
  this.type_ = type;
  this.source_ = source;
};


/**
 * @param {WebGLRenderingContext} gl
 */
webgl.Shader.prototype.create = function(gl) {
  this.handle = gl.createShader(this.type_);
  gl.shaderSource(this.handle, this.source_);
};


/**
 * @param {WebGLRenderingContext} gl
 */
webgl.Shader.prototype.compile = function(gl) {
  gl.compileShader(this.handle);
  if (!gl.getShaderParameter(this.handle, gl.COMPILE_STATUS)) {
    var log = gl.getShaderInfoLog(this.handle);
    this.dispose(gl);
    throw new Error(log);
  }
};


/**
 * @param {WebGLRenderingContext} gl
 */
webgl.Shader.prototype.dispose = function(gl) {
  gl.deleteShader(this.handle);
  this.handle = null;
};
