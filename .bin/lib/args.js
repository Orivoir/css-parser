class CliArgs {

  static PATTERN_OPTION = /^\-\-/;

  // public:

  constructor({ preNormalize }) {

    if( !process.argv || !(process.argv instanceof Array) ) {

      throw "argv not exists, invalid context.";
    }

    this.preNormalize = preNormalize;

  }

  get options() {

    return this.args.filter( arg => (
      CliArgs.PATTERN_OPTION.test( arg )
    ) );

  }

  get args() {

    let args = process.argv;

    if( this.preNormalize instanceof Function ) {

      args = this.preNormalize( args );
    }

    return args
      .map( arg => arg.trim() )
      .filter( arg => (
        !!arg.length
      ) )
    ;
  }

  isExistsArg( argname ) {

    return this.isExistsType( "arg", argname );
  }

  isExistsArgByPattern( argregex ) {

    return this.isExistsTypeByPattern( "arg", argregex );
  }

  isExistsOption( optionname ) {

    // normalize option name
    if( !CliArgs.PATTERN_OPTION.test( optionname ) ) {

      optionname = "--" + optionname;
    }

    return this.isExistsType( "option", optionname );
  }

  isExistsOptionByPattern( optionregex ) {

    return this.isExistsTypeByPattern("option", optionregex );
  }

  getArgsByPattern( argregex ) {

    return this.getTypeByPattern( "arg", argregex );
  }

  getOptionsByPattern( optionregex ) {

    return this.getTypeByPattern( "option", optionregex );
  }

  getArgByPosition( index ) {

    return this.args[ index ] || null;
  }

  // private:

  getSearcher( searcherName ) {

    if( typeof searcherName !== 'string' ) {

      throw new RangeError('arg1: searcherName, should be a string value');
    }

    searcherName = searcherName.toLocaleLowerCase();

    if( /^arg/.test( searcherName ) ) {

      return this.args;
    }

    return this.options;
  }

  isExistsType( type, val ) {

    const searcher = this.getSearcher( type );

    return searcher.find( current => current === val );
  }

  isExistsTypeByPattern( type, regex ) {

    const searcher = this.getSearcher( type );

    return searcher.find( current => regex.test( current ) );
  }

  getTypeByPattern( type, regex ) {

    const searcher = this.getSearcher( type );

    return searcher.filter( current => current.test(regex) );
  }

};

module.exports = CliArgs;
