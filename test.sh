#!/bin/sh
tests=$1
if [[ $tests = "" ]]; then
  tests="all"
fi
java -jar lib/jstestdriver/JsTestDriver.jar \
  --tests "$tests"
