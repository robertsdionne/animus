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
}

animus.Node.prototype.iterator = function() {
  return new animus.NodeIterator(this);
};
