// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

animus.load = function() {
  var keys = new animus.Keys(document);
  new webgl.App(window, keys)
      .install({
        'c0': new animus.Renderer(keys, 0)
      }, 'stats');
};
window.onload = animus.load;


/**
 * @constructor
 */
animus.Renderer = function(keys, index) {
  this.index_ = index;
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
  this.body_ = null;

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

  this.body_ = gl.createBuffer();

  this.p_.uProjection =
      gl.getUniformLocation(this.p_.handle, 'uProjection');
  this.p_.uTransform =
      gl.getUniformLocation(this.p_.handle, 'uTransform');
  this.p_.uTexture =
      gl.getUniformLocation(this.p_.handle, 'uTexture');
  this.p_.uLightTransform =
      gl.getUniformLocation(this.p_.handle, 'uLightTransform');
  this.p_.uSelectedJoint =
      gl.getUniformLocation(this.p_.handle, 'uSelectedJoint');
  this.p_.uJointPalette =
      gl.getUniformLocation(this.p_.handle, 'uJointPalette');

  this.p_.aPosition = gl.getAttribLocation(this.p_.handle, 'aPosition');
  this.p_.aNormal = gl.getAttribLocation(this.p_.handle, 'aNormal');
  this.p_.aColor = gl.getAttribLocation(this.p_.handle, 'aColor');
  this.p_.aJoint = gl.getAttribLocation(this.p_.handle, 'aJoint');

  this.p2_.uProjection =
      gl.getUniformLocation(this.p2_.handle, 'uProjection');
  this.p2_.uLightTransform =
      gl.getUniformLocation(this.p2_.handle, 'uLightTransform');
  this.p2_.uJointPalette =
      gl.getUniformLocation(this.p2_.handle, 'uJointPalette');

  this.p2_.aPosition = gl.getAttribLocation(this.p2_.handle, 'aPosition');
  this.p2_.aNormal = gl.getAttribLocation(this.p2_.handle, 'aNormal');
  this.p2_.aColor = gl.getAttribLocation(this.p2_.handle, 'aColor');
  this.p2_.aJoint = gl.getAttribLocation(this.p2_.handle, 'aJoint');

  this.texture_ = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.texture_);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 640, 640, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, null);

  this.rb_ = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, this.rb_);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 640, 640);

  this.framebuffer_ = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer_);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
      this.texture_, 0);
  gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.rb_);

  var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status != gl.FRAMEBUFFER_COMPLETE) {
    console.log(status);
  }

  var a = new animus.BoxMan()
      .add(1, 1, 2, 0.2)
      .add(2, 0.5, 0.5, 0.5)
      .add(3, 0.2, 0.5, 0.2)
      .add(4, 0.2, 0.5, 0.2)
      .add(5, 0.2, 0.5, 0.2)
      .add(6, 0.2, 0.5, 0.2)
      .add(7, 0.2, 1, 0.2)
      .add(8, 0.2, 1, 0.2)
      .add(9, 0.2, 1, 0.2)
      .add(10, 0.2, 1, 0.2)
      .add(11, 20, 1, 20)
      .build();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.body_);
  gl.bufferData(gl.ARRAY_BUFFER, a.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, a);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  this.rightCalf = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/4),
      new animus.Vector(0, 1.1, 0));
  this.rightThigh = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, Math.PI).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/4)),
      new animus.Vector(-0.4, -0.1, 0));
  this.rightThigh.children.push(this.rightCalf);
  this.leftCalf = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/2),
      new animus.Vector(0, 1.1, 0));
  this.leftThigh = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, -Math.PI).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/6)),
      new animus.Vector(0.4, -0.1, 0));
  this.leftThigh.children.push(this.leftCalf);
  this.rightForearm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/3),
      new animus.Vector(0, 0.6, 0));
  this.rightArm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/3).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, 5*Math.PI/6)),
      new animus.Vector(-0.6, 2, 0));
  this.rightArm.children.push(this.rightForearm);
  this.leftForearm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI/3),
      new animus.Vector(0, 0.6, 0));
  this.leftArm = new animus.Transform(
      animus.Quaternion.fromAxisAngle(animus.Vector.I, -Math.PI/3).times(
      animus.Quaternion.fromAxisAngle(animus.Vector.K, -5*Math.PI/6)),
      new animus.Vector(0.6, 2, 0));
  this.leftArm.children.push(this.leftForearm);
  this.skull = new animus.Transform(
      null,
      new animus.Vector(0, 2.1, 0));
  this.skeleton_ = new animus.Transform();
  this.skeleton_.children.push(
      this.skull, this.rightArm, this.leftArm,
      this.rightThigh, this.leftThigh);
  this.floor_ = new animus.Transform();
  this.floor_.translation = new animus.Vector(0., -5., 0.);
  this.root_ = new animus.Transform();
  this.root_.children.push(this.skeleton_, this.floor_);
  this.root_.translation = new animus.Vector(0, -0.5, -5.0);

  this.visitor_ = new animus.WebGlVisitor();
  this.joints_ = [
    this.skeleton_,
    this.skull,
    this.rightArm,
    this.rightForearm,
    this.leftArm,
    this.leftForearm,
    this.rightThigh,
    this.rightCalf,
    this.leftThigh,
    this.leftCalf
  ];
  this.selectedJoint_ = 0;
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


animus.Renderer.prototype.getTransform = function() {
  return [
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, -5.0, 1.0
  ];
};


animus.Renderer.prototype.getLightTransform = function() {
  return [
    1.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, -1.0, 0.0, 0.0,
    0.0, 0.0, -5.0, 1.0
  ];
};


animus.Renderer.DISPLACEMENT = 0.1;


animus.Renderer.ROTATION = Math.PI/64;


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onDraw = function(gl) {
  var joint = this.joints_[this.selectedJoint_ % 10];
  if (this.keys_.justPressed(animus.Keys.Key.N)) {
    this.selectedJoint_ += 1;
  }
  if (this.keys_.justPressed(animus.Keys.Key.P)) {
    this.selectedJoint_ -= 1;
  }
  if (this.keys_.isPressed(animus.Keys.Key.W)) {
    this.skeleton_.translation = this.skeleton_.translation.plus(
        animus.Vector.J.times(animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.S)) {
    this.skeleton_.translation = this.skeleton_.translation.plus(
        animus.Vector.J.times(-animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.D)) {
    this.skeleton_.translation = this.skeleton_.translation.plus(
        animus.Vector.I.times(animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.A)) {
    this.skeleton_.translation = this.skeleton_.translation.plus(
        animus.Vector.I.times(-animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.Z)) {
    this.skeleton_.translation = this.skeleton_.translation.plus(
        animus.Vector.K.times(animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.Q)) {
    this.skeleton_.translation = this.skeleton_.translation.plus(
        animus.Vector.K.times(-animus.Renderer.DISPLACEMENT));
  }
  if (this.keys_.isPressed(animus.Keys.Key.RIGHT)) {
    joint.rotation = joint.rotation.times(animus.Quaternion.fromAxisAngle(
        animus.Vector.K, animus.Renderer.ROTATION));
  }
  if (this.keys_.isPressed(animus.Keys.Key.LEFT)) {
    joint.rotation = joint.rotation.times(animus.Quaternion.fromAxisAngle(
        animus.Vector.K, -animus.Renderer.ROTATION));
  }
  if (this.keys_.isPressed(animus.Keys.Key.UP)) {
    joint.rotation = joint.rotation.times(animus.Quaternion.fromAxisAngle(
        animus.Vector.I, animus.Renderer.ROTATION));
  }
  if (this.keys_.isPressed(animus.Keys.Key.DOWN)) {
    joint.rotation = joint.rotation.times(animus.Quaternion.fromAxisAngle(
        animus.Vector.I, -animus.Renderer.ROTATION));
  }
  if (this.keys_.isPressed(animus.Keys.Key.LT)) {
    joint.rotation = joint.rotation.times(animus.Quaternion.fromAxisAngle(
        animus.Vector.J, animus.Renderer.ROTATION));
  }
  if (this.keys_.isPressed(animus.Keys.Key.GT)) {
    joint.rotation = joint.rotation.times(animus.Quaternion.fromAxisAngle(
        animus.Vector.J, -animus.Renderer.ROTATION));
  }

  if (this.index_ == 1) {
    gl.bindFramebuffer(gl.FRAMEBUFFER);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.cullFace(gl.FRONT);
    gl.useProgram(this.p2_.handle);
    gl.uniform1f(this.p2_.uSelectedJoint, this.selectedJoint_ % 10 + 1);
    gl.uniformMatrix4fv(this.p2_.uProjection, false,
        this.getPerspectiveProjectionMatrix());
    gl.uniformMatrix4fv(this.p2_.uLightTransform, false,
        this.getLightTransform());
    this.root_.translation = new animus.Vector();
    this.visitor_.traverse(this.root_);
    this.visitor_.render(gl, this.p2_, this.body_);
  }

  if (this.index_ == 0) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer_);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.cullFace(gl.FRONT);
    gl.useProgram(this.p2_.handle);
    gl.uniform1f(this.p2_.uSelectedJoint, this.selectedJoint_ % 10 + 1);
    gl.uniformMatrix4fv(this.p2_.uProjection, false,
        this.getPerspectiveProjectionMatrix());
    gl.uniformMatrix4fv(this.p2_.uLightTransform, false,
        this.getLightTransform());
    this.root_.translation = new animus.Vector();
    this.visitor_.traverse(this.root_);
    this.visitor_.render(gl, this.p2_, this.body_);

    gl.bindFramebuffer(gl.FRAMEBUFFER);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.p_.handle);
    gl.cullFace(gl.BACK);
    gl.uniform1i(this.p_.uTexture, this.texture_);
    gl.uniform1f(this.p_.uSelectedJoint, this.selectedJoint_ % 10 + 1);
    gl.uniformMatrix4fv(this.p_.uProjection, false,
        this.getPerspectiveProjectionMatrix());
    gl.uniformMatrix4fv(this.p_.uTransform, false,
        this.getTransform());
    gl.uniformMatrix4fv(this.p_.uLightTransform, false,
        this.getLightTransform());
    this.root_.translation = new animus.Vector();

    this.visitor_.traverse(this.root_);
    this.visitor_.render(gl, this.p_, this.body_);
  }

  gl.flush();
};
