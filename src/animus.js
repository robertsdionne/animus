// Copyright 2011 Robert Scott Dionne. All rights reserved.

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
  /**
   * @type {number}
   */
  this.index_ = index;

  /**
   * @type {!animus.Keys}
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
  this.skeleton_ = null;

  /**
   * @type {!animus.Animator}
   */
  this.animator_ = new animus.Animator();
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


animus.Renderer.prototype.getShaderSource = function(id) {
  return animus.global.document.getElementById(id).text;
};


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onCreate = function(gl) {
  this.keys_.install();
  var vertex = new webgl.Shader('v0',
      gl.VERTEX_SHADER,
      this.getShaderSource('quatlib') + this.getShaderSource('v0'));
  var fragment = new webgl.Shader('f0',
      gl.FRAGMENT_SHADER, this.getShaderSource('f0'));
  this.p_ = new webgl.Program(vertex, fragment);
  this.p_.create(gl);
  this.p_.link(gl);

  var vertex2 = new webgl.Shader('v1',
      gl.VERTEX_SHADER,
      this.getShaderSource('quatlib') + this.getShaderSource('v1'));
  var fragment2 = new webgl.Shader('f1',
      gl.FRAGMENT_SHADER, this.getShaderSource('f1'));
  this.p2_ = new webgl.Program(vertex2, fragment2);
  this.p2_.create(gl);
  this.p2_.link(gl);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  this.body_ = gl.createBuffer();

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

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  this.local0_ = new animus.Pose([
    // torso (0)
    new animus.DualQuaternion(),
    // skull (1)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0, 2.1, 0)),
    // right arm (2)
    animus.DualQuaternion.fromTranslation(new animus.Vector(-0.6, 2, 0)).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.I, Math.PI/3).
            times(animus.DualQuaternion.fromAxisAngle(
                animus.Vector.K, 5*Math.PI/6))),
    // right forearm (3)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0, 0.6, 0)).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.I, Math.PI/3)),
    // left arm (4)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0.6, 2, 0)).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.I, -Math.PI/3).
            times(animus.DualQuaternion.fromAxisAngle(
                animus.Vector.K, -5*Math.PI/6))),
    // left forearm (5)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0, 0.6, 0)).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.I, Math.PI/3)),
    // right thigh (6)
    animus.DualQuaternion.fromTranslation(new animus.Vector(-0.4, -0.1), 0).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.K, Math.PI).
            times(animus.DualQuaternion.fromAxisAngle(
                animus.Vector.I, Math.PI/4))),
    // right calf (7)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0, 1.1, 0)).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.I, -Math.PI/4)),
    // left thigh (8)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0.4, -0.1, 0)).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.K, -Math.PI).
            times(animus.DualQuaternion.fromAxisAngle(
                animus.Vector.I, 11*Math.PI/6))),
    // left calf (9)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0, 1.1, 0)).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.I, -Math.PI/2))
  ]);

  this.local1_ = new animus.Pose([
    // torso (0)
    new animus.DualQuaternion(),
    // skull (1)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0, 2.1, 0)),
    // right arm (2)
    animus.DualQuaternion.fromTranslation(new animus.Vector(-0.6, 2, 0)).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.K, Math.PI/2)),
    // right forearm (3)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0, 0.6, 0)),
    // left arm (4)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0.6, 2, 0)).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.K, -Math.PI/2)),
    // left forearm (5)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0, 0.6, 0)),
    // right thigh (6)
    animus.DualQuaternion.fromTranslation(new animus.Vector(-0.4, -0.1), 0).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.K, Math.PI)),
    // right calf (7)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0, 1.1, 0)),
    // left thigh (8)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0.4, -0.1, 0)).
        times(animus.DualQuaternion.fromAxisAngle(animus.Vector.K, Math.PI)),
    // left calf (9)
    animus.DualQuaternion.fromTranslation(new animus.Vector(0, 1.1, 0))
  ]);

  this.skeleton_ = new animus.Skeleton([
    null, // torso (0) -> null
    0,    // skull (1) -> torso (0)
    0,    // right arm (2) -> torso (0)
    2,    // right forearm (3) -> right arm (2)
    0,    // left arm (4) -> torso (0)
    4,    // left forearm (5) -> left arm (4)
    0,    // right thigh (6) -> torso (0)
    6,    // right calf (7) -> right thigh (6)
    0,    // left thigh (8) -> torso (0)
    8     // left calf (9) -> left thigh (8)
  ], this.local0_);

  this.blendT_ = 0.;

  var bind = this.local0_.globalize(this.skeleton_);
  var b = new animus.BoxMan()
      .add(0, bind.getJoint(0), 1, 2, 0.2)      // skeleton
      .add(1, bind.getJoint(1), 0.5, 0.5, 0.5)  // skull
      .add(2, bind.getJoint(2), 0.2, 0.5, 0.2)  // right arm
      .add(3, bind.getJoint(3), 0.2, 0.5, 0.2)  // right forearm
      .add(4, bind.getJoint(4), 0.2, 0.5, 0.2)  // left arm
      .add(5, bind.getJoint(5), 0.2, 0.5, 0.2)  // left forearm
      .add(6, bind.getJoint(6), 0.2, 1, 0.2)    // right thigh
      .add(7, bind.getJoint(7), 0.2, 1, 0.2)    // right calf
      .add(8, bind.getJoint(8), 0.2, 1, 0.2)    // left thigh
      .add(9, bind.getJoint(9), 0.2, 1, 0.2)   // left calf
      .build();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.body_);
  gl.bufferData(gl.ARRAY_BUFFER, b.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, b);
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


animus.Renderer.prototype.render = function(gl, program, buffer, palette) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.uniform4fv(program.uJointPalette, palette);
  gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 40, 0);
  gl.enableVertexAttribArray(program.aPosition);
  if (program.aNormal >= 0) {
    gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 40, 12);
    gl.enableVertexAttribArray(program.aNormal);
  }
  if (program.aColor >= 0) {
    gl.vertexAttribPointer(program.aColor, 3, gl.FLOAT, false, 40, 24);
    gl.enableVertexAttribArray(program.aColor);
  }
  if (program.aJoint >= 0) {
    gl.vertexAttribPointer(program.aJoint, 1, gl.FLOAT, false, 40, 36);
    gl.enableVertexAttribArray(program.aJoint);
  }
  gl.drawArrays(gl.TRIANGLES, 0, 360);
  gl.disableVertexAttribArray(program.aPosition);
  if (program.aNormal >= 0) {
    gl.disableVertexAttribArray(program.aNormal);
  }
  if (program.aColor >= 0) {
    gl.disableVertexAttribArray(program.aColor);
  }
  if (program.aJoint >= 0) {
    gl.disableVertexAttribArray(program.aJoint);
  }
};


animus.Renderer.prototype.shadowMapPass = function(gl) {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.cullFace(gl.FRONT);
  gl.useProgram(this.p2_.handle);
  gl.uniformMatrix4fv(this.p2_.uProjection, false,
      this.getPerspectiveProjectionMatrix());
  gl.uniformMatrix4fv(this.p2_.uLightTransform, false,
      this.getLightTransform());
  var palette = this.animator_.animate(
      this.skeleton_, this.local0_, this.local1_, this.blendT_);
  this.render(gl, this.p2_, this.body_, palette);
};


animus.Renderer.prototype.scenePass = function(gl) {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.useProgram(this.p_.handle);
  gl.cullFace(gl.BACK);
  gl.uniform1i(this.p_.uTexture, this.texture_);
  gl.uniformMatrix4fv(this.p_.uProjection, false,
      this.getPerspectiveProjectionMatrix());
  gl.uniformMatrix4fv(this.p_.uTransform, false,
      this.getTransform());
  gl.uniformMatrix4fv(this.p_.uLightTransform, false,
      this.getLightTransform());
  var palette = this.animator_.animate(
      this.skeleton_, this.local0_, this.local1_, this.blendT_);
  this.render(gl, this.p_, this.body_, palette);
};


animus.Renderer.DISPLACEMENT = 0.1;


animus.Renderer.ROTATION = Math.PI/64;


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onDraw = function(gl) {
  this.handleKeys();

  this.blendT_ = (+new Date() % 1000) / 500;
  animus.global.document.getElementById('t').innerText = this.blendT_;

  if (this.index_ == 0) {
    // Canvas 0: Render the full shadow mapped scene.
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer_);
    this.shadowMapPass(gl);
    gl.flush();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.scenePass(gl);
  } else {
    // Canvas 1: Render the shadow map.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.shadowMapPass(gl);
  }

  gl.flush();
};


animus.Renderer.DISPLACEMENT = 0.1;


animus.Renderer.ROTATION = Math.PI/64;


animus.Renderer.prototype.handleKeys = function() {
  if (this.keys_.isPressed(animus.Key.W)) {
    this.local0_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.J.times(animus.Renderer.DISPLACEMENT)).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.J.times(animus.Renderer.DISPLACEMENT)).
            times(this.local1_.getJoint(0)));
  }
  if (this.keys_.isPressed(animus.Key.S)) {
    this.local0_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.J.times(-animus.Renderer.DISPLACEMENT)).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.J.times(-animus.Renderer.DISPLACEMENT)).
            times(this.local1_.getJoint(0)));
  }
  if (this.keys_.isPressed(animus.Key.D)) {
    this.local0_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.I.times(animus.Renderer.DISPLACEMENT)).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.I.times(animus.Renderer.DISPLACEMENT)).
            times(this.local1_.getJoint(0)));
  }
  if (this.keys_.isPressed(animus.Key.A)) {
    this.local0_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.I.times(-animus.Renderer.DISPLACEMENT)).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.I.times(-animus.Renderer.DISPLACEMENT)).
            times(this.local1_.getJoint(0)));
  }
  if (this.keys_.isPressed(animus.Key.Z)) {
    this.local0_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.K.times(animus.Renderer.DISPLACEMENT)).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.K.times(animus.Renderer.DISPLACEMENT)).
            times(this.local1_.getJoint(0)));
  }
  if (this.keys_.isPressed(animus.Key.Q)) {
    this.local0_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.K.times(-animus.Renderer.DISPLACEMENT)).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromTranslation(
        animus.Vector.K.times(-animus.Renderer.DISPLACEMENT)).
            times(this.local1_.getJoint(0)));
  }
  if (this.keys_.isPressed(animus.Key.RIGHT)) {
    this.local0_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.K, animus.Renderer.ROTATION).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.K, animus.Renderer.ROTATION).
            times(this.local1_.getJoint(0)));
  }
  if (this.keys_.isPressed(animus.Key.LEFT)) {
    this.local0_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.K, -animus.Renderer.ROTATION).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.K, -animus.Renderer.ROTATION).
            times(this.local1_.getJoint(0)));
  }
  if (this.keys_.isPressed(animus.Key.UP)) {
    this.local0_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.I, animus.Renderer.ROTATION).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.I, animus.Renderer.ROTATION).
            times(this.local1_.getJoint(0)));
  }
  if (this.keys_.isPressed(animus.Key.DOWN)) {
    this.local0_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.I, -animus.Renderer.ROTATION).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.I, -animus.Renderer.ROTATION).
            times(this.local1_.getJoint(0)));
  }
  if (this.keys_.isPressed(animus.Key.LT)) {
    this.local0_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.J, animus.Renderer.ROTATION).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.J, animus.Renderer.ROTATION).
            times(this.local1_.getJoint(0)));
  }
  if (this.keys_.isPressed(animus.Key.GT)) {
    this.local0_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.J, -animus.Renderer.ROTATION).
            times(this.local0_.getJoint(0)));
    this.local1_.set(0, animus.DualQuaternion.fromAxisAngle(
        animus.Vector.J, -animus.Renderer.ROTATION).
            times(this.local1_.getJoint(0)));
  }
};
