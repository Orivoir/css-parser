const fs = require('fs');
const pathResolver = require('path');

const jsonWriting = require('./fs-json-writing');

module.exports = function() {

  const filename = "react-native-style-parser.config.js";

  jsonWriting({
    state: {
      entry: "./styles/css",
      output: "./styles/react",
      options: {
        es6: true,
        noQuote: true,
        watch: true,
        optimize: false,
      }

    },
    path: pathResolver.join( process.cwd(), filename ),
    isEs6: true,
    isOptimize: false
  });

};
