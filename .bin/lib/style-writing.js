const fs = require('fs');

function persistDataType( value ) {

  const PATTERN_ONLY_NUMBER = /^[\d]{0,}(\.)?[\d]{1,254}$/;

  if( PATTERN_ONLY_NUMBER.test( value ) || value.indexOf('"') !== -1 ) {

    return value;
  }

  return "'" + value + "'";
}


module.exports = function( {styles, path, isEs6, isOptimize} ) {

  const exportType = isEs6 ? "export default": "module.exports =";

  let append = `${exportType} {\n`;

  Object.keys( styles ).forEach( selector => {

    append += "\t'" + selector  + "'" + ": {\n";

    Object.keys( styles[selector] ).forEach(propertyName => {

      append += "\t\t'" + propertyName + "': " + persistDataType(styles[selector][propertyName]) +",\n"
    });

    append += "\t},\n";

  } );

  append += "};\n";

  if( isOptimize ) {

    while( append.indexOf('\n') !== -1 ) {

      append = append.replace('\n','');
    }

    while( append.indexOf('\t') !== -1 ) {
      append = append.replace('\t','');
    }
  }

  fs.writeFileSync(
    path,
    append,
    {
      encoding: "utf-8"
    }
  );

};
