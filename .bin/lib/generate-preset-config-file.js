const pathResolver = require('path');

const jsonWriting = require('fs-json-writer');

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
    isNoQuote: true
  });

  global.prettyLogs.success(`Added config file: ./${filename}\n`);
  global.prettyLogs.info(`Add key script from package.json: react-native-style-parser ./${filename}\n`);

  global.prettyLogs.info(`More infos on config from file: https://www.npmjs.com/package/react-native-style-parser#file`);
};
