/**
 * convert dash string to camel case string value
 * *e.g*: foo-bar => fooBar
 */
module.exports = function( dashValue ) {

  if( typeof dashValue !== "string") {

    throw new RangeError('arg1: dashValue, should be a string value');
  }

  if( dashValue.indexOf('-') === -1 ) return dashValue;

  let copy = '';

  let isFired = false;

  for( let i = 0, size= dashValue.length; i < size; i++ ) {

    if( dashValue[ i ] === "-" ) {

      isFired = true;

    } else {

      if( isFired ) {

        copy += dashValue[i].toLocaleUpperCase();

        isFired = false;
      } else {

        copy += dashValue[i];
      }
    }
  }

  return copy;
};
