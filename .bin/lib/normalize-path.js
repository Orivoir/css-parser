const pathResolver = require('path');

module.exports = function({
  root,
  path
}) {

  if( typeof root !== "string" ) {

    throw new RangeError( "root attribute should be a string value" );
  }

  if( typeof path !== "string" ) {

    throw new RangeError( "path attribute should be a string value" );
  }

  if( !pathResolver.isAbsolute( path ) ) {

    return pathResolver.join( root, path );
  }

  return path;
};
