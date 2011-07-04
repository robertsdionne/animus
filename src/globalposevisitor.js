// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @constructor
 * @extends {animus.Visitor}
 */
animus.GlobalPoseVisitor = function() {
  this.transformationStack_ = [new animus.DualQuaternion()];
  this.copyVisitor_ = new animus.CopyVisitor();
};
animus.inherits(animus.GlobalPoseVisitor, animus.Visitor);


/**
 * @param {animus.Node} node
 */
animus.GlobalPoseVisitor.prototype.traverse = function(node) {
  var copy = this.copyVisitor_.traverse(node);
  animus.GlobalPoseVisitor.superClass_.traverse.call(this, copy);
  return copy;
};


/**
 * @inheritDoc
 */
animus.GlobalPoseVisitor.prototype.visitTransform = function(transform) {
  this.transformationStack_.unshift(
      this.transformationStack_[0].times(transform.transform));
  transform.transform = this.transformationStack_[0];
  this.visitComposite(transform);
  this.transformationStack_.shift();
};
