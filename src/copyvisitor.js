// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @constructor
 * @extends {animus.Visitor}
 */
animus.CopyVisitor = function() {};
animus.inherits(animus.CopyVisitor, animus.Visitor);


/**
 * @param {animus.Node} node
 */
animus.CopyVisitor.prototype.traverse = function(node) {
  this.root_ = null;
  this.stack_ = [];
  animus.CopyVisitor.superClass_.traverse.call(this, node);
  this.stack_ = null;
  return this.root_;
};


/**
 * @inheritDoc
 */
animus.CopyVisitor.prototype.visitTransform = function(transform) {
  var copy = new animus.Transform(transform.transform);
  if (!this.root_) {
    this.root_ = copy;
  }
  var parent = this.stack_[0];
  if (parent) {
    parent.children.push(copy);
  }
  this.stack_.unshift(copy);
  this.visitComposite(transform);
  this.stack_.shift();
};
