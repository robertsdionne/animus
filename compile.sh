#!/bin/sh
java -jar lib/closure-compiler/compiler.jar \
  --compilation_level ADVANCED_OPTIMIZATIONS \
  --externs src/externs.js \
  --js src/base.js \
  --js src/quaternion.js \
  --js src/vector.js \
  --js src/boxman.js \
  --js src/scenegraph.js \
  --js src/app.js \
  --js src/program.js \
  --js src/renderer.js \
  --js src/shader.js \
  --js src/keys.js \
  --js src/animus.js \
  --js_output_file animus.js
