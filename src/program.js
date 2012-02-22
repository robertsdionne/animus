// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @constructor
 */
webgl.Program = function(vertex, fragment) {
  this.name = vertex.name + ':' + fragment.name;

  /**
   * @type {webgl.Shader}
   */
  this.vertex_ = vertex;

  /**
   * @type {webgl.Shader}
   */
  this.fragment_ = fragment;
};


webgl.Program.EXTRACT_ARRAY = /(.*)\[.*/;


webgl.Program.prototype.getSafeName = function(name) {
  var match = name.match(webgl.Program.EXTRACT_ARRAY);
  if (match) {
    return match[1];
  } else {
    return name;
  }
};


webgl.Program.prototype.defineUniforms = function(gl) {
  var uniforms = gl.getProgramParameter(this.handle, gl.ACTIVE_UNIFORMS);
  for (var i = 0; i < uniforms; ++i) {
    var name = this.getSafeName(gl.getActiveUniform(this.handle, i).name);
    this[name] = gl.getUniformLocation(this.handle, name);
  }
};


webgl.Program.prototype.defineAttributes = function(gl) {
  var attribs = gl.getProgramParameter(this.handle, gl.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < attribs; ++i) {
    var name = this.getSafeName(gl.getActiveAttrib(this.handle, i).name);
    this[name] = gl.getAttribLocation(this.handle, name);
  }
};


/**
 * @param {WebGLRenderingContext} gl
 */
webgl.Program.prototype.create = function(gl) {
  this.vertex_.create(gl);
  this.fragment_.create(gl);
  this.handle = gl.createProgram();
};


/**
 * @param {WebGLRenderingContext} gl
 */
webgl.Program.prototype.dispose = function(gl) {
  gl.detachShader(this.handle, this.vertex_.handle);
  this.vertex_.dispose(gl);
  gl.detachShader(this.handle, this.fragment_.handle);
  this.fragment_.dispose(gl);
  gl.deleteProgram(this.handle);
  this.handle = null;
};


/**
 * @param {WebGLRenderingContext} gl
 */
webgl.Program.prototype.link = function(gl) {
  this.vertex_.compile(gl);
  gl.attachShader(this.handle, this.vertex_.handle);
  this.fragment_.compile(gl);
  gl.attachShader(this.handle, this.fragment_.handle);
  gl.linkProgram(this.handle);
  if (!gl.getProgramParameter(this.handle, gl.LINK_STATUS)) {
    var log = gl.getProgramInfoLog(this.handle);
    this.dispose(gl);
    throw new Error(log);
  }
  this.defineUniforms(gl);
  this.defineAttributes(gl);
};
