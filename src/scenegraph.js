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
 * @constructor
 */
animus.Visitor = function() {};


/**
 * @param {animus.Node} node
 */
animus.Visitor.prototype.traverse = function(node) {
  node.accept(this);
};


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
 * @constructor
 * @extends {animus.Visitor}
 */
animus.WebGlVisitor = function() {
  this.index_ = 0;
  this.palette_ = new animus.Palette();
  this.transformationStack_ = [new animus.DualQuaternion()];
};
animus.inherits(animus.WebGlVisitor, animus.Visitor);


/**
 * @param {animus.Node} node
 */
animus.WebGlVisitor.prototype.traverse = function(node) {
  this.index_ = 0;
  this.palette_.reset();
  animus.WebGlVisitor.superClass_.traverse.call(this, node);
};


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
  this.palette_.set(this.index_++, this.transformationStack_[0]);
  this.visitComposite(transform);
  this.transformationStack_.shift();
};


animus.WebGlVisitor.prototype.render = function(gl, program, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.uniform4fv(program.uJointPalette, this.palette_.get());
  gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 40, 0);
  gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 40, 12);
  gl.vertexAttribPointer(program.aColor, 3, gl.FLOAT, false, 40, 24);
  gl.vertexAttribPointer(program.aJoint, 1, gl.FLOAT, false, 40, 36);
  gl.enableVertexAttribArray(program.aPosition);
  gl.enableVertexAttribArray(program.aNormal);
  gl.enableVertexAttribArray(program.aColor);
  gl.enableVertexAttribArray(program.aJoint);
  gl.drawArrays(gl.TRIANGLES, 0, 396);
  gl.disableVertexAttribArray(program.aPosition);
  gl.disableVertexAttribArray(program.aNormal);
  gl.disableVertexAttribArray(program.aColor);
  gl.disableVertexAttribArray(program.aJoint);
};
