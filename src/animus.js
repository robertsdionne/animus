// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

animus.load = function() {
  var canvas = animus.global.document.getElementById('c');
  var stats = animus.global.document.getElementById('stats');
  canvas.width = 640;
  canvas.height = 640;
  new webgl.App(window, new animus.Renderer(new animus.Keys(document)))
      .install(canvas, stats);
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
      this.getShaderSource('quatlib') + this.getShaderSource('v0'));
  var fragment = new webgl.Shader(
      gl.FRAGMENT_SHADER, this.getShaderSource('f0'));
  this.p_ = new webgl.Program(vertex, fragment);
  this.p_.create(gl);
  this.p_.link(gl);

  var vertex2 = new webgl.Shader(
      gl.VERTEX_SHADER,
      this.getShaderSource('quatlib') + this.getShaderSource('v1'));
  var fragment2 = new webgl.Shader(
      gl.FRAGMENT_SHADER, this.getShaderSource('f1'));
  this.p2_ = new webgl.Program(vertex2, fragment2);
  this.p2_.create(gl);
  this.p2_.link(gl);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  this.arm_ = gl.createBuffer();
  this.leg_ = gl.createBuffer();
  this.torso_ = gl.createBuffer();
  this.head_ = gl.createBuffer();

  this.p_.projection =
      gl.getUniformLocation(this.p_.handle, 'projection');
  this.p_.transformation =
      gl.getUniformLocation(this.p_.handle, 'transformation');

  this.p_.position = gl.getAttribLocation(this.p_.handle, 'position');
  this.p_.aNormal = gl.getAttribLocation(this.p_.handle, 'aNormal');
  this.p_.aColor = gl.getAttribLocation(this.p_.handle, 'aColor');

  this.p2_.projection =
      gl.getUniformLocation(this.p2_.handle, 'projection');
  this.p2_.transformation =
      gl.getUniformLocation(this.p2_.handle, 'transformation');

  this.p2_.position = gl.getAttribLocation(this.p2_.handle, 'position');
  this.p2_.aNormal = gl.getAttribLocation(this.p2_.handle, 'aNormal');
  this.p2_.aColor = gl.getAttribLocation(this.p2_.handle, 'aColor');

  this.texture_ = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.texture_);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, 128, 128, 0,
      gl.DEPTH_COMPONENT, gl.UNSIGNED_BYTE, null);

  this.framebuffer_ = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer_);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D,
      this.texture_, 0);

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
    0.0, 0.0, -101.0/99.0, -1.0,
    0.0, 0.0, -200.0/99.0, 0.0
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


animus.Renderer.DISPLACEMENT = 0.1;


animus.Renderer.ROTATION = Math.PI/64;


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onDraw = function(gl) {
  this.keys_.update();
  if (this.keys_.isPressed(animus.Keys.Key.W)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.J.times(animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.S)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.J.times(-animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.D)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.I.times(animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.A)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.I.times(-animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.Z)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.K.times(animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.Q)) {
    this.body_.translation = this.body_.translation.plus(
        animus.Vector.K.times(-animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.RIGHT)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.J, animus.Renderer.ROTATION).times(this.body_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.LEFT)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.J, -animus.Renderer.ROTATION).times(this.body_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.DOWN)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.I, animus.Renderer.ROTATION).times(this.body_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.UP)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.I, -animus.Renderer.ROTATION).times(this.body_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.LT)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.K, animus.Renderer.ROTATION).times(this.body_.rotation);
  }
  if (this.keys_.isPressed(animus.Keys.Key.GT)) {
    this.body_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.K, -animus.Renderer.ROTATION).times(this.body_.rotation);
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer_);
  gl.clear(gl.DEPTH_BUFFER_BIT);
  gl.cullFace(gl.FRONT);
  gl.useProgram(this.p2_.handle);
  gl.uniformMatrix4fv(this.p2_.projection, false,
      this.getOrthographicProjectionMatrix());
  this.visitor_.program = this.p2_;
  this.root_.rotation = animus.Quaternion.fromAxisAngle(
      animus.Vector.I, Math.PI / 2.0);
  this.root_.accept(this.visitor_);

  gl.bindFramebuffer(gl.FRAMEBUFFER);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.useProgram(this.p_.handle);
  gl.cullFace(gl.BACK);
  gl.uniformMatrix4fv(this.p_.projection, false,
      this.getPerspectiveProjectionMatrix());
  this.visitor_.program = this.p_;
  this.root_.rotation = new animus.Quaternion();
  this.root_.accept(this.visitor_);

  gl.flush();
};
