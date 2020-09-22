const fs = require('fs');

function persistDataType( value ) {

  if( typeof value === "string" ) {

    return "'"+value+"'";
  } else {

    return value;
  }
}

function styleWriteProperty( propertyName, isNoQuote ) {

  if( isNoQuote ) {

    return propertyName;
  } else {

    return "'"+propertyName+"'";
  }

}

module.exports = function( {
  styles,
  path,
  isEs6,
  isOptimize,
  isNoQuote
} ) {

  const exportType = isEs6 ? "export default": "module.exports =";

  let append = `${exportType} {\n`;

  Object.keys( styles ).forEach( selector => {

    append += "\t'" + selector  + "'" + ": {\n";

    Object.keys( styles[selector] ).forEach(propertyName => {

      append += `\t\t${styleWriteProperty( propertyName, isNoQuote )}: ${persistDataType(styles[selector][propertyName])},\n`;

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
