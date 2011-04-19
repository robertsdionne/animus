// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @constructor
 * @extends {animus.Visitor}
 */
animus.PaletteVisitor = function() {};
animus.inherits(animus.PaletteVisitor, animus.Visitor);


/**
 * @param {animus.Node} node
 */
animus.PaletteVisitor.prototype.traverse = function(node) {
  this.index_ = 0;
  this.palette_ = new animus.Palette();
  animus.PaletteVisitor.superClass_.traverse.call(this, node);
  var result = this.palette_;
  this.palette_ = null;
  return result;
};


/**
 * @inheritDoc
 */
animus.PaletteVisitor.prototype.visitTransform = function(transform) {
  this.palette_.set(this.index_++, transform.transform);
  this.visitComposite(transform);
};
