// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

var animus = {};
var webgl = {};


animus.global = this;


animus.global.requestAnimationFrame = (function() {
  return animus.global.requestAnimationFrame ||
      animus.global.webkitRequestAnimationFrame ||
      animus.global.mozRequestAnimationFrame ||
      animus.global.oRequestAnimationFrame ||
      animus.global.msRequestAnimationFrame ||
      function(callback, element) {
        animus.global.setTimeout(callback, 1000/60);
      };
})();


animus.inherits = function(child, parent) {
  var temp = function() {};
  temp.prototype = parent.prototype;
  child.superClass_ = parent.prototype;
  child.prototype = new temp();
  child.prototype.constructor = child;
};


animus.bind = function(fn, self) {
  var context = self || animus.global;
  if (arguments > 2) {
    var bound = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(arguments, bound);
      return fn.apply(context, newArgs);
    };
  } else {
    return function() {
      return fn.apply(context, arguments);
    }
  }
};


animus.nullFunction = function() {};


animus.abstractMethod = function() {
  throw new Error('Unimplemented abstract method.');
};
