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


animus.Renderer.prototype.getShaderSource = function(id) {
  return animus.global.document.getElementById(id).text;
};


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onCreate = function(gl) {
  this.keys_.install();
  var vertex = new webgl.Shader(
      gl.VERTEX_SHADER,
      this.getShaderSource('quatlib') + this.getShaderSource('v'));
  var fragment = new webgl.Shader(
      gl.FRAGMENT_SHADER, this.getShaderSource('f'));
  this.p_ = new webgl.Program(vertex, fragment);
  this.p_.create(gl);
  this.p_.link(gl);
  gl.useProgram(this.p_.handle);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
//gl.cullFace(gl.FRONT);

  this.arm_ = gl.createBuffer();
  this.leg_ = gl.createBuffer();
  this.torso_ = gl.createBuffer();
  this.head_ = gl.createBuffer();

  this.p_.projection =
      gl.getUniformLocation(this.p_.handle, 'projection');
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
  this.rightCalf = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/4),
      new animus.Vector(0, 1.1, 0));
  this.rightCalf.children.push(leg);
  this.rightThigh = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, Math.PI).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/4)),
      new animus.Vector(-0.4, -0.1, 0));
  this.rightThigh.children.push(leg, this.rightCalf);
  this.leftCalf = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/2),
      new animus.Vector(0, 1.1, 0));
  this.leftCalf.children.push(leg);
  this.leftThigh = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, -Math.PI).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/6)),
      new animus.Vector(0.4, -0.1, 0));
  this.leftThigh.children.push(leg, this.leftCalf);
  this.rightForearm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/3),
      new animus.Vector(0, 0.6, 0));
  this.rightForearm.children.push(arm);
  this.rightArm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/3).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, 5*Math.PI/6)),
      new animus.Vector(-0.6, 2, 0));
  this.rightArm.children.push(arm, this.rightForearm);
  this.leftForearm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/3),
      new animus.Vector(0, 0.6, 0));
  this.leftForearm.children.push(arm);
  this.leftArm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/3).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, -5*Math.PI/6)),
      new animus.Vector(0.6, 2, 0));
  this.leftArm.children.push(arm, this.leftForearm);
  this.skull = new animus.Transform(
      null,
      new animus.Vector(0, 2.1, 0));
  this.skull.children.push(head);
  this.body_ = new animus.Transform();
  this.body_.children.push(
      torso, this.rightThigh, this.leftThigh,
      this.rightArm, this.leftArm, this.skull);
  this.root_ = new animus.Transform();
  this.root_.children.push(this.body_);
  this.root_.translation = new animus.Vector(0, -0.5, -5.0);

  this.visitor_ = new animus.WebGlVisitor(gl);
};


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onDestroy = animus.nullFunction;


animus.Renderer.prototype.getPerspectiveProjectionMatrix = function() {
  return [
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, -11.0/9.0, -1.0,
    0.0, 0.0, -20.0/9.0, 0.0
  ];
};


animus.Renderer.prototype.getOrthographicProjectionMatrix = function() {
  return [
    1.0/4.0, 0.0, 0.0, 0.0,
    0.0, 1.0/4.0, 0.0, 0.0,
    0.0, 0.0, -2.0/9.0, 0.0,
    0.0, 0.0, -11.0/9.0, 1.0
  ];
};


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onDraw = function(gl) {
  this.keys_.update();
  if (this.keys_.isPressed(animus.Keys.Key.W)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.J.times(0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.S)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.J.times(-0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.D)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.I.times(0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.A)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.I.times(-0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.Z)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.K.times(0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.Q)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.K.times(-0.01));
  }
  if (this.keys_.isPressed(animus.Keys.Key.RIGHT)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.J, Math.PI/128).times(this.body_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.LEFT)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.J, -Math.PI/128).times(this.body_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.DOWN)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.I, Math.PI/128).times(this.body_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.UP)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.I, -Math.PI/128).times(this.body_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.LT)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.K, Math.PI/128).times(this.body_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.GT)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.K, -Math.PI/128).times(this.body_.rotation);
  }
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  this.visitor_.projection = this.getPerspectiveProjectionMatrix();
  this.root_.rotation = animus.Quaternion.fromAxisAngle(
      animus.Vector.I, Math.PI / 2.0);
  this.root_.accept(this.visitor_);
  gl.flush();
};
