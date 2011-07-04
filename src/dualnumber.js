// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @fileoverview Defines the dual number object.
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

animus.DualNumber = function(real, dual) {
  this.real = real || 0;
  this.dual = dual || 0;
};


animus.DualNumber.prototype.dualConjugate = function() {
  return new animus.DualNumber(this.real, -this.dual);
};


animus.DualNumber.prototype.plus = function(that) {
  return new animus.DualNumber(this.real + that.real, this.dual + that.dual);
};


animus.DualNumber.prototype.minus = function(that) {
  return new animus.DualNumber(this.real - that.real, this.dual - that.dual);
};


animus.DualNumber.prototype.negate = function() {
  return new animus.DualNumber(-this.real, -this.dual);
};


animus.DualNumber.prototype.times = function(that) {
  return new animus.DualNumber(
      this.real * that.real,
      this.real * that.dual + this.dual * that.real);
};


animus.DualNumber.prototype.inverse = function() {
  return new animus.DualNumber(
      1 / this.real,
      -this.dual / this.real / this.real);
};


animus.DualNumber.prototype.over = function(that) {
  return this.times(that.inverse());
};


animus.DualNumber.prototype.sqrt = function() {
  return new animus.DualNumber(
      Math.sqrt(this.real),
      this.dual / 2 / Math.sqrt(this.real));
};


animus.DualNumber.prototype.toString = function() {
  return this.real + ' + ' + this.dual + 'e';
};
