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
  this.transform = animus.DualQuaternion.fromTranslation(this.translation).
      times(animus.DualQuaternion.fromRotation(this.rotation));
};
animus.inherits(animus.Transform, animus.Composite);


/**
 * @inheritDoc
 */
animus.Transform.prototype.accept = function(visitor) {
  this.transform = animus.DualQuaternion.fromTranslation(this.translation).
      times(animus.DualQuaternion.fromRotation(this.rotation));
  visitor.visitTransform(this);
};


/**
 * @param {WebGLBuffer} buffer
 * @constructor
 * @extends {animus.Leaf}
 */
animus.Geometry = function(buffer) {
  this.buffer_ = buffer;
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
animus.Geometry.prototype.render = function(
    gl, program, transformation) {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_);
  gl.uniform4fv(program.transformation, [
      transformation.vector.x.real,
      transformation.vector.y.real,
      transformation.vector.z.real,
      transformation.scalar.real,
      transformation.vector.x.dual,
      transformation.vector.y.dual,
      transformation.vector.z.dual,
      transformation.scalar.dual
  ]);
  gl.vertexAttribPointer(program.position, 3, gl.FLOAT, false, 36, 0);
  gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 36, 12);
  gl.vertexAttribPointer(program.aColor, 3, gl.FLOAT, false, 36, 24);
  gl.enableVertexAttribArray(program.position);
  gl.enableVertexAttribArray(program.aNormal);
  gl.enableVertexAttribArray(program.aColor);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  gl.disableVertexAttribArray(program.position);
  gl.disableVertexAttribArray(program.aNormal);
  gl.disableVertexAttribArray(program.aColor);
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
  this.transformationStack_ = [new animus.DualQuaternion()];
  this.program = null;
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
  this.transformationStack_.unshift(
      this.transformationStack_[0].times(transform.transform));
  this.visitComposite(transform);
  this.transformationStack_.shift();
};


/**
 * @inheritDoc
 */
animus.WebGlVisitor.prototype.visitGeometry = function(geometry) {
  geometry.render(
      this.gl_,
      this.program,
      this.transformationStack_[0]);
};
