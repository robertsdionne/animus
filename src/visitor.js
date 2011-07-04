// Copyright 2011 Robert Scott Dionne. All rights reserved.

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
animus.Visitor.prototype.visitComposite = function(composite) {
  var visitor = this;
  composite.children.forEach(function(child) {
    child.accept(visitor);
  });
};


/**
 * @param {animus.KnobTransform} knobTransform
 */
animus.Visitor.prototype.visitKnobTransform = animus.nullFunction;


/**
 * @param {animus.Transform} transform
 */
animus.Visitor.prototype.visitTransform = animus.nullFunction;
