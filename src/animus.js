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


  /**
   * @type {animus.Node}
   */
  this.root_ = null;


  /**
   * @type {animus.Visitor}
   */
  this.visitor_ = null;
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

  this.p_.rotation =
      gl.getUniformLocation(this.p_.handle, 'rotation');
  this.p_.translation =
      gl.getUniformLocation(this.p_.handle, 'translation');

  this.p_.position = gl.getAttribLocation(this.p_.handle, 'position');

  var data = [
    0.0, 0.0, 0.0,
    0.0, 0.5, 0.0
  ];

  var a = new Float32Array(data);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.b_);
  gl.bufferData(gl.ARRAY_BUFFER, a.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, a);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var segment = new animus.Geometry(this.b_, this.p_);
  var joint = new animus.Transform();
  joint.rotation = animus.Quaternion.fromAxisAngle(animus.Vector.K, Math.PI/8);
  joint.translation = new animus.Vector(0, 0.5, 0);
  joint.children.push(segment);

  this.root_ = new animus.Transform();
  this.root_.children.push(segment);
  this.root_.children.push(joint);

  this.root_.rotation =
      animus.Quaternion.fromAxisAngle(animus.Vector.K, Math.PI/8);
  this.root_.translation = new animus.Vector(0, -0.5, 0);

  this.visitor_ = new animus.WebGlVisitor(gl);
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
  this.root_.accept(this.visitor_);
  gl.flush();
};
