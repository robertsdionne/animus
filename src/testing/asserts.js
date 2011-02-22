
var assertRoughlyEquals = function(expected, actual, tolerance) {
  assertTrue('|' + expected + ' - ' + actual + '| < ' + tolerance,
      Math.abs(expected - actual) < tolerance);
};
