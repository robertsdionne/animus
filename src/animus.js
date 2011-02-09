// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

animus.load = function() {
  var canvas = animus.global.document.getElementById('c');
  canvas.width = 640;
  canvas.height = 640;
  new webgl.App(window, new animus.Renderer()).install(canvas);
};
window.onload = animus.load;


/**
 * @constructor
 */
animus.Renderer = function() {
  /**
   * @type {WebGLProgram}
   */
  this.p_ = null;

  /**
   * @type {WebGLBuffer}
   */
  this.b_ = null;
};
animus.inherits(animus.Renderer, webgl.Renderer);


/**
 * @param {WebGLRenderingContext} gl
 * @param {number} width
 * @param {number} height
 */
animus.Renderer.prototype.onChange = function(gl, width, height) {
  gl.viewport(0, 0, width, height);
};


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onCreate = function(gl) {
  var vertex = new webgl.Shader(
      gl.VERTEX_SHADER, animus.global.document.getElementById('v').text);
  var fragment = new webgl.Shader(
      gl.FRAGMENT_SHADER, animus.global.document.getElementById('f').text);
  this.p_ = new webgl.Program(vertex, fragment);
  this.p_.create(gl);
  this.p_.link(gl);
  gl.useProgram(this.p_.handle);

  this.b_ = gl.createBuffer();

  this.p_.rotationPalette =
      gl.getUniformLocation(this.p_.handle, 'rotationPalette');
  this.p_.translationPalette =
      gl.getUniformLocation(this.p_.handle, 'translationPalette');

  this.p_.position = gl.getAttribLocation(this.p_.handle, 'position');
  this.p_.jointIndices = gl.getAttribLocation(this.p_.handle, 'jointIndices');
  this.p_.jointWeights = gl.getAttribLocation(this.p_.handle, 'jointWeights');

  var data = [
    0.0, 0.0, 0.0,
    0.0, 1.0, 0.0
  ];

  var a = new Float32Array(data);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.b_);
  gl.bufferData(gl.ARRAY_BUFFER, a.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, a);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
};


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onDestroy = animus.nullFunction;


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onDraw = function(gl) {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.b_);
  gl.vertexAttribPointer(this.p_.position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(this.p_.position);
  gl.drawArrays(gl.LINE_STRIP, 0, 2);
  gl.disableVertexAttribArray(this.p_.position);
  gl.flush();
};
