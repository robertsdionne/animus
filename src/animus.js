// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

animus.load = function() {
  var canvas = animus.global.document.getElementById('c');
  canvas.width = 640;
  canvas.height = 640;
  new webgl.App(window, new animus.Renderer(new animus.Keys(document)))
      .install(canvas);
};
window.onload = animus.load;


/**
 * @constructor
 */
animus.Renderer = function(keys) {
  /**
   * @type {animus.Keys}
   */
  this.keys_ = keys;

  /**
   * @type {WebGLProgram}
   */
  this.p_ = null;

  /**
   * @type {WebGLBuffer}
   */
  this.arm_ = null;

  /**
   * @type {WebGLBuffer}
   */
  this.leg_ = null;

  /**
   * @type {WebGLBuffer}
   */
  this.torso_ = null;

  /**
   * @type {WebGLBuffer}
   */
  this.head_ = null;

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


var N = 32;


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onCreate = function(gl) {
  this.keys_.install();
  var vertex = new webgl.Shader(
      gl.VERTEX_SHADER, animus.global.document.getElementById('v').text);
  var fragment = new webgl.Shader(
      gl.FRAGMENT_SHADER, animus.global.document.getElementById('f').text);
  this.p_ = new webgl.Program(vertex, fragment);
  this.p_.create(gl);
  this.p_.link(gl);
  gl.useProgram(this.p_.handle);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  this.arm_ = gl.createBuffer();
  this.leg_ = gl.createBuffer();
  this.torso_ = gl.createBuffer();
  this.head_ = gl.createBuffer();

  this.p_.rotation =
      gl.getUniformLocation(this.p_.handle, 'rotation');
  this.p_.translation =
      gl.getUniformLocation(this.p_.handle, 'translation');

  this.p_.position = gl.getAttribLocation(this.p_.handle, 'position');
  this.p_.aNormal = gl.getAttribLocation(this.p_.handle, 'aNormal');
  this.p_.aColor = gl.getAttribLocation(this.p_.handle, 'aColor');

  var a = new animus.BoxMan().add(0.2, 0.5, 0.2).build();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.arm_);
  gl.bufferData(gl.ARRAY_BUFFER, a.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, a);

  a = new animus.BoxMan().add(0.2, 1, 0.2).build();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.leg_);
  gl.bufferData(gl.ARRAY_BUFFER, a.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, a);

  a = new animus.BoxMan().add(1, 2, 0.2).build();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.torso_);
  gl.bufferData(gl.ARRAY_BUFFER, a.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, a);

  a = new animus.BoxMan().add(0.5, 0.5, 0.5).build();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.head_);
  gl.bufferData(gl.ARRAY_BUFFER, a.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, a);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  var arm = new animus.Geometry(this.arm_, this.p_);
  var leg = new animus.Geometry(this.leg_, this.p_);
  var torso = new animus.Geometry(this.torso_, this.p_);
  var head = new animus.Geometry(this.head_, this.p_);
  var rightCalf = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/4),
      new animus.Vector(0, 1.1, 0));
  rightCalf.children.push(leg);
  var rightThigh = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, Math.PI).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/4)),
      new animus.Vector(-0.4, -0.1, 0));
  rightThigh.children.push(leg, rightCalf);
  var leftCalf = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/2),
      new animus.Vector(0, 1.1, 0));
  leftCalf.children.push(leg);
  var leftThigh = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, -Math.PI).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/6)),
      new animus.Vector(0.4, -0.1, 0));
  leftThigh.children.push(leg, leftCalf);
  var rightForearm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/3),
      new animus.Vector(0, 0.6, 0));
  rightForearm.children.push(arm);
  var rightArm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/3).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, 5*Math.PI/6)),
      new animus.Vector(-0.6, 2, 0));
  rightArm.children.push(arm, rightForearm);
  var leftForearm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/3),
      new animus.Vector(0, 0.6, 0));
  leftForearm.children.push(arm);
  var leftArm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/3).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, -5*Math.PI/6)),
      new animus.Vector(0.6, 2, 0));
  leftArm.children.push(arm, leftForearm);
  var skull = new animus.Transform(
      null,
      new animus.Vector(0, 2.1, 0));
  skull.children.push(head);
  this.root_ = new animus.Transform();
  this.root_.children.push(
      torso, rightThigh, leftThigh, rightArm, leftArm, skull);
  this.joint_ = [];
  this.root_.translation = new animus.Vector(0, -0.5, -5.0);

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
  this.keys_.update();
  if (this.keys_.isPressed(animus.Keys.Key.W)) {
    this.root_.translation = this.root_.translation.plus(
        animus.Vector.J.times(0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.S)) {
    this.root_.translation = this.root_.translation.plus(
        animus.Vector.J.times(-0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.D)) {
    this.root_.translation = this.root_.translation.plus(
        animus.Vector.I.times(0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.A)) {
    this.root_.translation = this.root_.translation.plus(
        animus.Vector.I.times(-0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.Z)) {
    this.root_.translation = this.root_.translation.plus(
        animus.Vector.K.times(0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.Q)) {
    this.root_.translation = this.root_.translation.plus(
        animus.Vector.K.times(-0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.RIGHT)) {
    this.root_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.J, Math.PI/128).times(this.root_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.LEFT)) {
    this.root_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.J, -Math.PI/128).times(this.root_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.DOWN)) {
    this.root_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.I, Math.PI/128).times(this.root_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.UP)) {
    this.root_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.I, -Math.PI/128).times(this.root_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.LT)) {
    this.root_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.K, Math.PI/128).times(this.root_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.GT)) {
    this.root_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.K, -Math.PI/128).times(this.root_.rotation);
  }
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  this.root_.accept(this.visitor_);
  gl.flush();
};
