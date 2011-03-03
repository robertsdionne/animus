// Copyright 2011 Robert Scott Dionne. All Rights Reserved.


/**
 * @constructor
 */
var ArrayBuffer = function() {};


/**
 * @constructor
 */
var ArrayBufferView = function() {};


/**
 * @constructor
 * @extends {ArrayBufferView}
 */
var Float32Array = function() {};


/** @typedef {number} */ var GLbitfield;
/** @typedef {boolean} */ var GLboolean;
/** @typedef {number} */ var GLclampf;
/** @typedef {number} */ var GLenum;
/** @typedef {number} */ var GLfloat;
/** @typedef {number} */ var GLint;
/** @typedef {number} */ var GLintptr;
/** @typedef {number} */ var GLsizei;
/** @typedef {number} */ var GLsizeiptr;
/** @typedef {number} */ var GLuint;


/**
 * @constructor
 */
var WebGLBuffer = function() {};


/**
 * @constructor
 */
var WebGLRenderingContext = function() {};


/** @type {GLenum} */
WebGLRenderingContext.prototype.ARRAY_BUFFER;


/** @type {GLenum} */
WebGLRenderingContext.prototype.COLOR_BUFFER_BIT;


/** @type {GLenum} */
WebGLRenderingContext.prototype.COMPILE_STATUS;


/** @type {GLenum} */
WebGLRenderingContext.prototype.CULL_FACE;


/** @type {GLenum} */
WebGLRenderingContext.prototype.DEPTH_BUFFER_BIT;


/** @type {GLenum} */
WebGLRenderingContext.prototype.DEPTH_TEST;


/** @type {GLenum} */
WebGLRenderingContext.prototype.FLOAT;


/** @type {GLenum} */
WebGLRenderingContext.prototype.FRAGMENT_SHADER;


/** @type {GLenum} */
WebGLRenderingContext.prototype.LINE_STRIP;


/** @type {GLenum} */
WebGLRenderingContext.prototype.LINES;


/** @type {GLenum} */
WebGLRenderingContext.prototype.LINK_STATUS;


/** @type {GLenum} */
WebGLRenderingContext.prototype.STATIC_DRAW;


/** @type {GLenum} */
WebGLRenderingContext.prototype.TRIANGLES;


/** @type {GLenum} */
WebGLRenderingContext.prototype.VERTEX_SHADER;


/**
 * @param {WebGLProgram} program
 * @param {WebGLShader} shader
 */
WebGLRenderingContext.prototype.attachShader = function(program, shader) {};


/**
 * @param {GLenum} target
 * @param {WebGLBuffer} buffer
 */
WebGLRenderingContext.prototype.bindBuffer = function(target, buffer) {};


/**
 * @param {GLenum} target
 * @param {GLsizeiptr} size
 * @param {GLenum} usage
 */
WebGLRenderingContext.prototype.bufferData = function(target, size, usage) {};


/**
 * @param {GLenum} target
 * @param {GLintptr} offset
 * @param {ArrayBuffer|ArrayBufferView} data
 */
WebGLRenderingContext.prototype.bufferSubData =
    function(target, offset, data) {};


/**
 * @param {GLbitfield} mask
 */
WebGLRenderingContext.prototype.clear = function(mask) {};


/**
 * @param {GLclampf} red
 * @param {GLclampf} green
 * @param {GLclampf} blue
 * @param {GLclampf} alpha
 */
WebGLRenderingContext.prototype.clearColor =
    function(red, green, blue, alpha) {};


/**
 * @param {WebGLShader} shader
 */
WebGLRenderingContext.prototype.compileShader = function(shader) {};


/**
 * @return {WebGLBuffer}
 */
WebGLRenderingContext.prototype.createBuffer = function() {};


/**
 * @return {WebGLProgram}
 */
WebGLRenderingContext.prototype.createProgram = function() {};


/**
 * @param {GLenum} type
 * @return {WebGLShader}
 */
WebGLRenderingContext.prototype.createShader = function(type) {};


/**
 * @param {WebGLProgram} program
 */
WebGLRenderingContext.prototype.deleteProgram = function(program) {};


/**
 * @param {WebGLShader} shader
 */
WebGLRenderingContext.prototype.deleteShader = function(shader) {};


/**
 * @param {WebGLProgram} program
 * @param {WebGLShader} shader
 */
WebGLRenderingContext.prototype.detachShader = function(program, shader) {};


/**
 * @param {GLuint} index
 */
WebGLRenderingContext.prototype.disableVertexAttribArray = function(index) {};


/**
 * @param {GLenum} mode
 * @param {GLint} first
 * @param {GLsizei} count
 */
WebGLRenderingContext.prototype.drawArrays = function(mode, first, count) {};


/**
 * @param {GLenum} cap
 */
WebGLRenderingContext.prototype.enable = function(cap) {};


/**
 * @param {GLuint} index
 */
WebGLRenderingContext.prototype.enableVertexAttribArray = function(index) {};


/**
 */
WebGLRenderingContext.prototype.flush = function() {};


/**
 * @param {WebGLProgram} program
 * @param {string} name
 * @return {GLint}
 */
WebGLRenderingContext.prototype.getAttribLocation = function(program, name) {};


/**
 * @param {WebGLProgram} program
 * @return {string}
 */
WebGLRenderingContext.prototype.getProgramInfoLog = function(program) {};


/**
 * @param {WebGLProgram} program
 * @param {GLenum} pname
 * @return {boolean|number}
 */
WebGLRenderingContext.prototype.getProgramParameter =
    function(program, pname) {};


/**
 * @param {WebGLShader} shader
 * @return {string}
 */
WebGLRenderingContext.prototype.getShaderInfoLog = function(shader) {};


/**
 * @param {WebGLShader} shader
 * @param {GLenum} pname
 * @return {boolean|number}
 */
WebGLRenderingContext.prototype.getShaderParameter = function(shader, pname) {};


/**
 * @param {WebGLProgram} program
 * @param {string} name
 * @return {WebGLUniformLocation}
 */
WebGLRenderingContext.prototype.getUniformLocation = function(program, name) {};


/**
 * @param {WebGLProgram} program
 */
WebGLRenderingContext.prototype.linkProgram = function(program) {};


/**
 * @param {WebGLShader} shader
 * @param {string} source
 */
WebGLRenderingContext.prototype.shaderSource = function(shader, source) {};


/**
 * @param {WebGLUniformLocation} location
 * @param {GLfloat} x
 * @param {GLfloat} y
 * @param {GLfloat} z
 */
WebGLRenderingContext.prototype.uniform3f = function(location, x, y, z) {};


/**
 * @param {WebGLUniformLocation} location
 * @param {GLfloat} x
 * @param {GLfloat} y
 * @param {GLfloat} z
 * @param {GLfloat} w
 */
WebGLRenderingContext.prototype.uniform4f = function(location, x, y, z, w) {};


/**
 * @param {WebGLProgram} program
 */
WebGLRenderingContext.prototype.useProgram = function(program) {};


/**
 * @param {GLuint} indx
 * @param {GLint} size
 * @param {GLenum} type
 * @param {GLboolean} normalized
 * @param {GLsizei} stride
 * @param {GLintptr} offset
 */
WebGLRenderingContext.prototype.vertexAttribPointer =
    function(x, y, width, height) {};


/**
 * @param {GLint} x
 * @param {GLint} y
 * @param {GLsizei} width
 * @param {GLsizei} height
 */
WebGLRenderingContext.prototype.viewport = function(x, y, width, height) {};


/**
 * @constructor
 */
var WebGLProgram = function() {};


/**
 * @constructor
 */
var WebGLShader = function() {};


/**
 * @constructor
 */
var WebGLUniformLocation = function() {};
