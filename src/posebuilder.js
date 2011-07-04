// Copyright 2011 Robert Scott Dionne. All rights reserved.


animus.PoseBuilder = function() {
  this.reset();
};


animus.PoseBuilder.prototype.build = function() {
  this.leftArm.children.push(this.leftForearm);
  this.rightArm.children.push(this.rightForearm);
  this.leftThigh.children.push(this.leftCalf);
  this.rightThigh.children.push(this.rightCalf);
  this.torso.children.push(this.head, this.rightArm, this.leftArm,
      this.rightThigh, this.leftThigh);
  var result = this.torso;
  this.reset();
  return result;
};


animus.PoseBuilder.prototype.reset = function() {
  this.head = new animus.KnobTransform();
  this.leftForearm = new animus.KnobTransform();
  this.leftArm = new animus.KnobTransform();
  this.rightForearm = new animus.KnobTransform();
  this.rightArm = new animus.KnobTransform();
  this.leftCalf = new animus.KnobTransform();
  this.leftThigh = new animus.KnobTransform();
  this.rightCalf = new animus.KnobTransform();
  this.rightThigh = new animus.KnobTransform();
  this.torso = new animus.KnobTransform();
};


animus.PoseBuilder.prototype.setHead = function(rotate, translate) {
  this.head = new animus.KnobTransform(rotate, translate);
  return this;
};


animus.PoseBuilder.prototype.setLeftForearm = function(rotate, translate) {
  this.leftForearm = new animus.KnobTransform(rotate, translate);
  return this;
};


animus.PoseBuilder.prototype.setLeftArm = function(rotate, translate) {
  this.leftArm = new animus.KnobTransform(rotate, translate);
  return this;
};


animus.PoseBuilder.prototype.setRightForearm = function(rotate, translate) {
  this.rightForearm = new animus.KnobTransform(rotate, translate);
  return this;
};


animus.PoseBuilder.prototype.setRightArm = function(rotate, translate) {
  this.rightArm = new animus.KnobTransform(rotate, translate);
  return this;
};


animus.PoseBuilder.prototype.setLeftCalf = function(rotate, translate) {
  this.leftCalf = new animus.KnobTransform(rotate, translate);
  return this;
};


animus.PoseBuilder.prototype.setLeftThigh = function(rotate, translate) {
  this.leftThigh = new animus.KnobTransform(rotate, translate);
  return this;
};


animus.PoseBuilder.prototype.setRightCalf = function(rotate, translate) {
  this.rightCalf = new animus.KnobTransform(rotate, translate);
  return this;
};


animus.PoseBuilder.prototype.setRightThigh = function(rotate, translate) {
  this.rightThigh = new animus.KnobTransform(rotate, translate);
  return this;
};


animus.PoseBuilder.prototype.setTorso = function(rotate, translate) {
  this.torso = new animus.KnobTransform(rotate, translate);
  return this;
};
