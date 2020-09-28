class CssLoadValue {

  static get PATTERN_IS_PX_VALUE() {

    return /^[\d]{1,}(\.)?[\d]{0,}px/;
  }

  static get PATTERN_ONLY_NUMBER() {

    return /^(\-)?[\d]{0,}(\.)?[\d]{1,254}$/;
  }

  static transformValue( value ) {

    if( CssLoadValue.PATTERN_IS_PX_VALUE.test(value) ) {

      return parseFloat( value );
    } else if( CssLoadValue.PATTERN_ONLY_NUMBER.test( value ) ) {

      return parseFloat( value );

    } else {

      return value;
    }

  }

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

      loaded[ functionName ] = CssLoadValue.transformValue(value);

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
