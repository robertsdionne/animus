// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

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
