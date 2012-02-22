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
   * @type {WebGLBuffer}
   */
  this.floor_ = null;

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
  var aspect = width/height;
  this.projection_ = this.getFrustumMatrix(-aspect, aspect, -1, 1, 1, 1000);
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

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  this.body_ = gl.createBuffer();
  this.floor_ = gl.createBuffer();
  this.floorFrame_ = gl.createBuffer();

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

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  this.root_ = animus.DualQuaternion.fromTranslation(
      new animus.Vector(0, 0, -5));

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
  var b = new animus.BoxMan().
      add(0, bind.getBone(0), 1, 2, 0.2).      // skeleton
      add(1, bind.getBone(1), 0.5, 0.5, 0.5).  // skull
      add(2, bind.getBone(2), 0.2, 0.5, 0.2).  // right arm
      add(3, bind.getBone(3), 0.2, 0.5, 0.2).  // right forearm
      add(4, bind.getBone(4), 0.2, 0.5, 0.2).  // left arm
      add(5, bind.getBone(5), 0.2, 0.5, 0.2).  // left forearm
      add(6, bind.getBone(6), 0.2, 1, 0.2).    // right thigh
      add(7, bind.getBone(7), 0.2, 1, 0.2).    // right calf
      add(8, bind.getBone(8), 0.2, 1, 0.2).    // left thigh
      add(9, bind.getBone(9), 0.2, 1, 0.2).   // left calf
      build();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.body_);
  gl.bufferData(gl.ARRAY_BUFFER, b.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, b);

  var grid = new animus.Grid(
      -2, 50, 50, 50, 50, [.21, .44, .33], [.42, .58, .44]);
  b = grid.buildTriangles();
  this.floorVertexCount_ = grid.getTriangleVertexCount();
  this.floorFrameVertexCount_ = grid.getWireframeVertexCount();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.floor_);
  gl.bufferData(gl.ARRAY_BUFFER, b.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, b);

  b = grid.buildWireframe();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.floorFrame_);
  gl.bufferData(gl.ARRAY_BUFFER, b.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, b);
};


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onDestroy = animus.nullFunction;


animus.Renderer.prototype.getFrustumMatrix = function(
    left, right, bottom, top, near, far) {
  var a = (right + left) / (right - left);
  var b = (top + bottom) / (top - bottom);
  var c = -(far + near) / (far - near);
  var d = -(2 * far * near) / (far - near);
  return [
    2 * near / (right - left), 0, 0, 0,
    0, 2 * near / (top - bottom), 0, 0,
    a, b, c, -1,
    0, 0, d, 0
  ];
};


animus.Renderer.prototype.render = function(
    gl, program, buffer, palette, n, type) {
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
  gl.drawArrays(type, 0, n);
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


animus.Renderer.prototype.scenePass = function(gl) {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.useProgram(this.p_.handle);
  gl.cullFace(gl.BACK);
  gl.depthFunc(gl.LESS);
  gl.uniformMatrix4fv(this.p_.uProjection, false, this.projection_);
  gl.uniform1i(this.p_.uLighting, true);
  var palette = this.animator_.animate(this.skeleton_, this.root_,
      this.local0_, this.local1_, this.blendT_);
  this.render(gl, this.p_, this.body_, palette, 360, gl.TRIANGLES);
  this.render(
      gl, this.p_, this.floor_, palette, this.floorVertexCount_, gl.TRIANGLES);
  gl.depthFunc(gl.LEQUAL);
  gl.uniform1i(this.p_.uLighting, true);
  this.render(gl, this.p_, this.floorFrame_, palette,
      this.floorFrameVertexCount_, gl.LINES);
};


animus.Renderer.DISPLACEMENT = 0.1;


animus.Renderer.ROTATION = Math.PI/64;


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onDraw = function(gl) {
  this.handleKeys();

  animus.global.document.getElementById('t').innerText = this.blendT_;

  if (this.index_ == 0) {
    // Canvas 0: Render the full shadow mapped scene.
    this.scenePass(gl);
  }
  gl.flush();
};


animus.Renderer.DISPLACEMENT = 0.1;


animus.Renderer.ROTATION = Math.PI/64;


animus.Renderer.prototype.handleKeys = function() {
  if (this.keys_.isPressed(animus.Key.J)) {
    this.blendT_ -= 0.05;
  }
  if (this.keys_.isPressed(animus.Key.K)) {
    this.blendT_ += 0.05;
  }
  if (this.keys_.isPressed(animus.Key.W)) {
    this.root_ = animus.DualQuaternion.fromTranslation(
        animus.Vector.K.times(animus.Renderer.DISPLACEMENT)).
            times(this.root_);
  }
  if (this.keys_.isPressed(animus.Key.S)) {
    this.root_ = animus.DualQuaternion.fromTranslation(
        animus.Vector.K.times(-animus.Renderer.DISPLACEMENT)).
            times(this.root_);
  }
  if (this.keys_.isPressed(animus.Key.A)) {
    this.root_ = animus.DualQuaternion.fromTranslation(
        animus.Vector.I.times(animus.Renderer.DISPLACEMENT)).
            times(this.root_);
  }
  if (this.keys_.isPressed(animus.Key.D)) {
    this.root_ = animus.DualQuaternion.fromTranslation(
        animus.Vector.I.times(-animus.Renderer.DISPLACEMENT)).
            times(this.root_);
  }
  if (this.keys_.isPressed(animus.Key.Z)) {
    this.root_ = animus.DualQuaternion.fromTranslation(
        animus.Vector.J.times(animus.Renderer.DISPLACEMENT)).
            times(this.root_);
  }
  if (this.keys_.isPressed(animus.Key.Q)) {
    this.root_ = animus.DualQuaternion.fromTranslation(
        animus.Vector.J.times(-animus.Renderer.DISPLACEMENT)).
            times(this.root_);
  }
  if (this.keys_.isPressed(animus.Key.RIGHT)) {
    this.root_ = animus.DualQuaternion.fromAxisAngle(
        animus.Vector.J, animus.Renderer.ROTATION).times(this.root_);
  }
  if (this.keys_.isPressed(animus.Key.LEFT)) {
    this.root_ = animus.DualQuaternion.fromAxisAngle(
        animus.Vector.J, -animus.Renderer.ROTATION).times(this.root_);
  }
  if (this.keys_.isPressed(animus.Key.DOWN)) {
    this.root_ = animus.DualQuaternion.fromAxisAngle(
        animus.Vector.I, animus.Renderer.ROTATION).times(this.root_);
  }
  if (this.keys_.isPressed(animus.Key.UP)) {
    this.root_ = animus.DualQuaternion.fromAxisAngle(
        animus.Vector.I, -animus.Renderer.ROTATION).times(this.root_);
  }
  if (this.keys_.isPressed(animus.Key.GT)) {
    this.root_ = animus.DualQuaternion.fromAxisAngle(
        animus.Vector.K, animus.Renderer.ROTATION).times(this.root_);
  }
  if (this.keys_.isPressed(animus.Key.LT)) {
    this.root_ = animus.DualQuaternion.fromAxisAngle(
        animus.Vector.K, -animus.Renderer.ROTATION).times(this.root_);
  }
};
