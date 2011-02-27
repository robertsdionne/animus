// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @constructor
 */
animus.Node = function() {};


/**
 * @param {animus.Visitor} visitor
 */
animus.Node.prototype.accept = function(visitor) {
  visitor.visitNode(this);
};


/**
 * @constructor
 * @extends {animus.Node}
 */
animus.Composite = function() {
  this.children = [];
};
animus.inherits(animus.Composite, animus.Node);


/**
 * @inheritDoc
 */
animus.Composite.prototype.accept = function(visitor) {
  visitor.visitComposite(this);
};


/**
 * @constructor
 * @extends {animus.Node}
 */
animus.Leaf = function() {};
animus.inherits(animus.Leaf, animus.Node);


/**
 * @inheritDoc
 */
animus.Leaf.prototype.accept = function(visitor) {
  visitor.visitLeaf(this);
};


/**
 * @param {animus.Quaternion} opt_rotation
 * @param {animus.Vector} opt_translation
 * @constructor
 * @extends {animus.Composite}
 */
animus.Transform = function(opt_rotation, opt_translation) {
  animus.Transform.superClass_.constructor.call(this);
  this.rotation = opt_rotation || new animus.Quaternion();
  this.translation = opt_translation || new animus.Vector();
};
animus.inherits(animus.Transform, animus.Composite);


/**
 * @inheritDoc
 */
animus.Transform.prototype.accept = function(visitor) {
  visitor.visitTransform(this);
};


/**
 * @param {WebGLBuffer} buffer
 * @param {animus.Program} program
 * @constructor
 * @extends {animus.Leaf}
 */
animus.Geometry = function(buffer, program) {
  this.buffer_ = buffer;
  this.program_ = program;
};
animus.inherits(animus.Geometry, animus.Leaf);


/**
 * @inheritDoc
 */
animus.Geometry.prototype.accept = function(visitor) {
  visitor.visitGeometry(this);
};


/**
 * @param {WebGLRenderingContext} gl
 * @param {animus.Quaternion} rotation
 * @param {animus.Vector} translation
 */
animus.Geometry.prototype.render = function(gl, rotation, translation) {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_);
  gl.uniform4f(this.program_.rotation,
      rotation.vector().x(),
      rotation.vector().y(),
      rotation.vector().z(),
      rotation.scalar());
  gl.uniform3f(this.program_.translation,
      translation.x(),
      translation.y(),
      translation.z());
  gl.vertexAttribPointer(this.program_.position, 3, gl.FLOAT, false, 24, 0);
  gl.vertexAttribPointer(this.program_.aColor, 3, gl.FLOAT, false, 24, 12);
  gl.enableVertexAttribArray(this.program_.position);
  gl.enableVertexAttribArray(this.program_.aColor);
  gl.drawArrays(gl.LINES, 0, 6);
  gl.disableVertexAttribArray(this.program_.position);
  gl.disableVertexAttribArray(this.program_.aColor);
};


/**
 * @constructor
 */
animus.Visitor = function() {};


/**
 * @param {animus.Node} node
 */
animus.Visitor.prototype.visitNode = animus.nullFunction;


/**
 * @param {animus.Composite} composite
 */
animus.Visitor.prototype.visitComposite = animus.nullFunction;


/**
 * @param {animus.Leaf} leaf
 */
animus.Visitor.prototype.visitLeaf = animus.nullFunction;


/**
 * @param {animus.Transform} transform
 */
animus.Visitor.prototype.visitTransform = animus.nullFunction;


/**
 * @param {animus.Geometry} geometry
 */
animus.Visitor.prototype.visitGeometry = animus.nullFunction;


/**
 * @param {WebGLRenderingContext} gl
 * @constructor
 * @extends {animus.Visitor}
 */
animus.WebGlVisitor = function(gl) {
  this.gl_ = gl;
  this.rotationStack_ = [new animus.Quaternion()];
  this.translationStack_ = [new animus.Vector()];
};
animus.inherits(animus.WebGlVisitor, animus.Visitor);


/**
 * @inheritDoc
 */
animus.WebGlVisitor.prototype.visitComposite = function(composite) {
  var visitor = this;
  composite.children.forEach(function(child) {
    child.accept(visitor);
  });
};


/**
 * @inheritDoc
 */
animus.WebGlVisitor.prototype.visitTransform = function(transform) {
  this.translationStack_.unshift(this.translationStack_[0].plus(
      this.rotationStack_[0].rotate(transform.translation)));
  this.rotationStack_.unshift(
      this.rotationStack_[0].times(transform.rotation));
  this.visitComposite(transform);
  this.rotationStack_.shift();
  this.translationStack_.shift();
};


/**
 * @inheritDoc
 */
animus.WebGlVisitor.prototype.visitGeometry = function(geometry) {
  geometry.render(
      this.gl_, this.rotationStack_[0], this.translationStack_[0]);
};
