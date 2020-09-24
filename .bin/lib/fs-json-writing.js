const fs = require('fs');

let append = "";
let depth = 1;

function persistDataType( value ) {

  if( typeof value === "string" ) {

    return "'"+value+"'";
  } else {

    return value;
  }
}

function generateIndent() {

  return Array.from( Array( depth ).keys() ).map( () => "\t" ).join('');
}

function onLoopObject( obj ) {

  Object.keys( obj ).forEach( property => {

    append += generateIndent() + "'" + property  + "'" + ": ";

    if( typeof obj[ property ] === "object" ) {

      depth++;

      append += " {\n";
      onLoopObject( obj[ property ] );
    } else {

      append += persistDataType( obj[property] ) + ",\n" ;
    }

  } );

  if( depth > 1 ) {
    depth--;
    append += generateIndent() + "},\n";
  }
}

/**
 * @warn this function should be export, refactoring and test from another package limit the dependence from this package
 *
 * @see ./generate-preset-config-file.js
 *
 *
 * write JSON content with persist indent level from file system
 *
 */
module.exports = function( {
  state,
  path,
  isEs6
} ) {

  append = "";
  depth = 1;

  const exportType = isEs6 ? "export default": "module.exports =";

  append = `${exportType} {\n`;

  onLoopObject( state );

  append += "};\n";

  fs.writeFileSync(
    path,
    append,
    {
      encoding: "utf-8"
    }
  );

};
