#!/bin/sh
java -jar lib/jstestdriver/JsTestDriver.jar --port 9876 &

JSTD=$!

sleep 5

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --incognito \
  http://localhost:9876/capture &

java -jar lib/jstestdriver/JsTestDriver.jar \
  --tests all \
  --server http://localhost:9876

kill $JSTD
