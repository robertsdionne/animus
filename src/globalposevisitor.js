// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @constructor
 * @extends {animus.Visitor}
 */
animus.GlobalPoseVisitor = function() {
  this.transformationStack_ = [new animus.DualQuaternion()];
};
animus.inherits(animus.GlobalPoseVisitor, animus.Visitor);


/**
 * @param {animus.Node} node
 */
animus.GlobalPoseVisitor.prototype.traverse = function(node) {
  this.index_ = 0;
  this.palette_ = new animus.Palette();
  animus.GlobalPoseVisitor.superClass_.traverse.call(this, node);
  var result = this.palette_;
  this.palette_ = null;
  return result;
};


/**
 * @inheritDoc
 */
animus.GlobalPoseVisitor.prototype.visitComposite = function(composite) {
  var visitor = this;
  composite.children.forEach(function(child) {
    child.accept(visitor);
  });
};


/**
 * @inheritDoc
 */
animus.GlobalPoseVisitor.prototype.visitTransform = function(transform) {
  this.transformationStack_.unshift(
      this.transformationStack_[0].times(transform.transform));
  this.palette_.set(this.index_++, this.transformationStack_[0]);
  this.visitComposite(transform);
  this.transformationStack_.shift();
};
