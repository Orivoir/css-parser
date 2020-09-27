const fs = require('fs');

const jsonWriter = require('fs-json-writer');

module.exports = function( {
  styles,
  path,
  isEs6,
  isNoQuote,

  isOptimize
} ) {

  jsonWriter({
    state: styles,
    path,
    isEs6,
    isNoQuote,
    isOptimize
  });

  // json writer do not support is optimize flag
  // because generate human content readable
  if( isOptimize ) {

    let state = require( path );

    // minified json content
    state = JSON.stringify( state );

    state = "module.exports="+state;
    // re write content
    fs.writeFileSync( path, state, {
      encoding: "utf-8"
    } );

  }

};
