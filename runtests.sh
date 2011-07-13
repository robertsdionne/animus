#!/bin/sh
java -jar lib/jstestdriver/JsTestDriver.jar --port 9876 &

JSTD=$!

sleep 5

chromium-browser --incognito \
  http://localhost:9876/capture &

java -jar lib/jstestdriver/JsTestDriver.jar \
  --tests all \
  --server http://localhost:9876

kill $JSTD
