// Copyright 2011 Robert Scott Dionne. All rights reserved.

var assertRoughlyEquals = function(expected, actual, tolerance) {
  assertTrue('|' + expected + ' - ' + actual + '| < ' + tolerance,
      Math.abs(expected - actual) < tolerance);
};
