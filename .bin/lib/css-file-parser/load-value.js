class CssLoadValue {

  constructor( value ) {

    if( typeof value === "string" ) {

      this.load( value );
    }
  }

  load( value ) {

    this.value = value;

    this.value = this.value.split(',');

    this.value = this.value.map( directive => {

      let [ functionName, value ] = directive.split('(');

      value = value.slice( 0, -1 ).trim();

      const loaded = {};

      loaded[ functionName ] = value;

      return loaded;

    } );

    return this.value;

  }

  getLoaded( value=null ) {

    if( typeof value === "string" ) {

      this.load( value );
    }

    return this.value;
  }
}

module.exports = CssLoadValue;
