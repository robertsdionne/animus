// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @constructor
 * @extends {animus.Visitor}
 */
animus.BlendVisitor = function() {
  this.visitor = new animus.CopyVisitor();
};
animus.inherits(animus.BlendVisitor, animus.Visitor);


/**
 * @param {animus.Node} node
 */
animus.BlendVisitor.prototype.blend = function(node, other, t) {
  var copy = this.visitor.traverse(node);
  this.iterator = other.iterator();
  this.t = t;
  animus.BlendVisitor.superClass_.traverse.call(this, copy);
  this.iterator = null;
  this.t = null;
  return copy;
};


/**
 * @inheritDoc
 */
animus.BlendVisitor.prototype.visitKnobTransform = function(transform) {
  transform.transform = transform.transform.lerp(
      this.iterator.next().transform, this.t);
  this.visitComposite(transform);
};
