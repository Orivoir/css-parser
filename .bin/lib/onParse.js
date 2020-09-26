const pathResolver = require('path');
const CssFileParser = require('./css-file-parser/parser');
const styleWriting = require('./style-writing');

module.exports = function( filename ) {

  const createStylesheet = new CssFileParser( filename );

  const pathWrite = pathResolver.join(
    global.paths.output,
    pathResolver.basename(filename).replace( 'css', 'js' )
  );

  styleWriting({
    styles: createStylesheet.stylesheet,
    path: pathWrite,
    isEs6: global.options.isEs6 ,
    isOptimize: global.options.isOptimize,
    isNoQuote: global.options.isNoQuote
  });

  global.prettyLogs.success(
    `${pathResolver.basename(filename)} => ${pathWrite}`
  );

};
