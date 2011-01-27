// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('animus');

goog.require('webgl.App');
goog.require('webgl.Renderer');

goog.require('goog.dom');


animus.load = function() {
  var canvas = goog.dom.getElement('c');
  canvas.width = 640;
  canvas.height = 640;
  new webgl.App(window, new animus.Renderer()).install(canvas);
};


animus.Renderer = function() {
  this.p_ = null;
  this.b_ = null;
};
goog.inherits(animus.Renderer, webgl.Renderer);


animus.Renderer.prototype.onChange = function(gl, width, height) {
  gl.viewport(0, 0, width, height);
};


animus.Renderer.prototype.onCreate = function(gl) {
  this.p_ = gl.createProgram();
  this.b_ = gl.createBuffer();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  var v = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(v, document.getElementById('v').text);
  var result = gl.compileShader(v);
  gl.compileShader(v);
  if (!gl.getShaderParameter(v, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(v));
  }
  gl.attachShader(this.p_, v);
  gl.deleteShader(v); v = null;
  var f = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(f, document.getElementById('f').text);
  gl.compileShader(f);
  if (!gl.getShaderParameter(f, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(f));
  }
  gl.attachShader(this.p_, f);
  gl.deleteShader(f); f = null;
  gl.linkProgram(this.p_);
  gl.useProgram(this.p_);

  this.p_.position = gl.getAttribLocation(this.p_, 'position');

  var data = [];
  data.push(1, 0, 0);
  data.push(0, 1, 0);
  data.push(0, 0, 0);

  var a = new Float32Array(data);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.b_);
  gl.bufferData(gl.ARRAY_BUFFER, a.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, a);
};


animus.Renderer.prototype.onDestroy = goog.nullFunction;


animus.Renderer.prototype.onDraw = function(gl) {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.b_);
  gl.vertexAttribPointer(this.p_.position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(this.p_.position);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.disableVertexAttribArray(this.p_.position);
  gl.flush();
};
