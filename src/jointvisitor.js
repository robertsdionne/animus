// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @constructor
 * @extends {animus.Visitor}
 */
animus.JointVisitor = function() {};
animus.inherits(animus.JointVisitor, animus.Visitor);


/**
 * @param {animus.Node} node
 */
animus.JointVisitor.prototype.traverse = function(node) {
  this.joints_ = [];
  animus.JointVisitor.superClass_.traverse.call(this, node);
  return this.joints_;
};


/**
 * @inheritDoc
 */
animus.JointVisitor.prototype.visitKnobTransform = function(transform) {
  this.joints_.push(transform);
  this.visitComposite(transform);
};
