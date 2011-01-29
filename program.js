

// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('webgl.Program');


webgl.Program = function(vertex, fragment) {
  this.vertex_ = vertex;
  this.fragment_ = fragment;
};


webgl.Program.prototype = {
  create = function(gl) {
    this.vertex_.create(gl);
    this.fragment_.create(gl);
    this.handle = gl.createProgram();
  },


  dispose: function(gl) {
    gl.detachShader(this.handle, this.vertex_.handle);
    this.vertex_.dispose(gl);
    gl.detachShader(this.handle, this.fragment_.handle);
    this.fragment_.dispose(gl);
    gl.deleteProgram(this.handle);
    this.handle = null;
  },


  link: function(gl) {
    this.vertex_.compile(gl);
    gl.attachShader(this.handle, this.vertex_.handle);
    this.fragment_.compile(gl);
    gl.attachShader(this.handle, this.fragment_.handle);
    gl.linkProgram(this.handle);
    if (!gl.getProgramParameter(this.handle, gl.LINK_STATUS)) {
      var log = gl.getShaderInfoLog(this.handle);
      this.dispose();
      throw new Error(log);
    }
  }
};
