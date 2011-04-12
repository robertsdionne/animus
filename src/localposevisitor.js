// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @constructor
 * @extends {animus.Visitor}
 */
animus.LocalPoseVisitor = function() {};
animus.inherits(animus.LocalPoseVisitor, animus.Visitor);


/**
 * @param {animus.Node} node
 */
animus.LocalPoseVisitor.prototype.traverse = function(node) {
  this.root_ = null;
  this.stack_ = [];
  animus.LocalPoseVisitor.superClass_.traverse.call(this, node);
  this.stack_ = null;
  return this.root_;
};


/**
 * @inheritDoc
 */
animus.LocalPoseVisitor.prototype.visitKnobTransform = function(knobTransform) {
  var transform = new animus.Transform(
      knobTransform.translation.times(knobTransform.rotation));
  if (!this.root_) {
    this.root_ = transform;
  }
  var parent = this.stack_[0];
  if (parent) {
    parent.children.push(transform);
  }
  this.stack_.unshift(transform);
  this.visitComposite(knobTransform);
  this.stack_.shift();
};
