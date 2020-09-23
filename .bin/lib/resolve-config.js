const ResolveEntry = require('./resolve-entry');
const normalizePath = require('./normalize-path');

/**
 * CssFileParser is import for transform dash string value to camel case string value from
 * static method `transformPropertyName`
 */
const CssFileParser = require('./css-file-parser/parser');

const fs = require('fs');
const pathResolver = require('path');

class ConfigResolver {

  static get SHEME_CONFIG_FILE() {

    return {

      entry: {
        isRequired: true,
        typeof: "string",
        describe: ""
      },
      output: {
        isRequired: true,
        typeof: "string",
        describe: ""
      },

      options: {
        isRequired: false,
        typeof: "object",
        default: ConfigResolver.DEFAULT_OPTIONS,
        describe: "",
      }
    };

  }

  static get DEFAULT_OPTIONS() {

    return {
      isWatch: ConfigResolver.DEFAUL_IS_WATCH,
      isEs6: ConfigResolver.DEFAULT_IS_ES6,
      isOptimize: ConfigResolver.DEFAULT_IS_OPTIMIZE,
      isNoQuote: ConfigResolver.DEFAULT_IS_NO_QUOTE
    };

  }
  static get DEFAUL_IS_WATCH() {

    return false;
  }
  static get DEFAULT_IS_ES6() {

    return false;
  }
  static get DEFAULT_IS_OPTIMIZE() {

    return false;
  }
  static get DEFAULT_IS_NO_QUOTE() {

    return false;
  }

  static isCommentLine( line ) {

    return /^\_/.test( line );
  }

  static isHydraLine( line ) {

    return /^\@/.test( line );
  }

  constructor( handlerArg ) {

    this.resolverEntryPath = new ResolveEntry;

    ResolveEntry
      .setAllowsTypeFiles(["css"])
      .setIsAllowDirectory( true )
    ;

    this.handlerArg = handlerArg;

    this.options = {};
    this.paths = {};

    if( this.isFileConfig ) {

      this.hydrate( this.normalizeConfig( this.contentConfigFile ) );

    } else {

      this.hydrate( this.normalizeConfig( this.contentConfigCommandLine ) );
    }

    if( !fs.existsSync( this.paths.entry ) ) {

      throw new RangeError("path entry not found");
    }

    this.resolverEntryPath.path = this.paths.entry;
  }

  // config should be already normalized
  hydrate( config ) {

    const options = this.normalizeOptions( config.options );

    const {
      isEs6,
      isNoQuote,
      isWatch,
      isOptimize
    } = options;

    const {
      entry,
      output
    } = config;

    this.options = {
      isEs6,
      isNoQuote,
      isWatch,
      isOptimize
    };

    this.paths.entry = normalizePath( {
      root: process.cwd(),
      path: entry
    } );

    this.paths.output = normalizePath({
      root: process.cwd(),
      path: output
    });

    return {
      options: this.options,
      paths: this.paths
    };

  }

  normalizeOptions( options ) {

    if( !options ) {

      return ConfigResolver.DEFAULT_OPTIONS;
    }

    const optionsBuild = {};

    Object.keys( options ).forEach( optionName => {

      let newOptionsName = optionName;

      if( !/^is/.test(optionName) ) {

        newOptionsName =  "is" + ( optionName.charAt( 0 ).toLocaleUpperCase() + optionName.slice( 1, ) );
      }

      newOptionsName = CssFileParser.transformPropertyName(newOptionsName);

      optionsBuild[ newOptionsName ] = options[ optionName ];

    } );

    return optionsBuild;
  }

  normalizeConfig( defaultConfig ) {

    const shemeConfig = ConfigResolver.SHEME_CONFIG_FILE;

    const buildConfig = {};

    Object.keys( defaultConfig ).forEach( key => {

      if(
        typeof shemeConfig[ key ] === "undefined" &&
        !ConfigResolver.isCommentLine(defaultConfig[key]) &&
        !ConfigResolver.isHydraLine( defaultConfig[key] )
      ) {

        const message = `config shema invalid, key: '${key}' is not recognize.`;
        throw new RangeError( message );
      } else if( shemeConfig[key].typeof !== typeof defaultConfig[key] && shemeConfig[key] ) {

        const message = `config shema invalid, type of: '${key}' should be: ${shemeConfig[key].typeof}`;
        throw new RangeError( message );
      } else {
        buildConfig[ key ] = defaultConfig[ key ];
      }

    } );

    // check if required key not exists
    Object.keys( shemeConfig ).filter( key => {

      return shemeConfig[ key ].isRequired

    } ).forEach( keyRequired => {

      if( typeof buildConfig[ keyRequired ] === "undefined" ) {

        const message = `config shema invalid, key: '${key}', is required -- ${shemeConfig[keyRequired].describe}`;
        throw new RangeError( message );
      }

    } );

    return buildConfig;
  }

  get isFileConfig() {
    // during exec with config file arg1 should be relative path to config file
    // and not another arg should exists
    return this.handlerArg.args.length === 1;
  }

  get pathConfigFile() {

    return normalizePath({
      root: process.cwd(),
      path: this.handlerArg.getArgByPosition( 0 )
    });

  }

  get isValidPathConfigFile() {

    if( !this.isFileConfig ) return false;

    const pathConfigFile = this.pathConfigFile;

    if( fs.existsSync( pathConfigFile ) ) {

      const stat = fs.statSync( pathConfigFile );

      if( !!stat.isFile() ) {

        const filename = pathResolver.basename( pathConfigFile );

        const ext = filename.split('.').slice( -1 )[0];

        return /^js(on)?$/i.test(ext);

      } else {

        return false;
      }

    } else {

      return false;
    }

  }

  get contentConfigFile() {

    if( !this.isValidPathConfigFile ) {

      throw new RangeError('path to config file is invalid');
    }

    return require( this.pathConfigFile );
  }

  get contentConfigCommandLine() {

    const options = {
      isWatch: !!this.handlerArg.isExistsOption('watch'),
      isEs6: !!this.handlerArg.isExistsOption('es6'),
      isOptimize: !!this.handlerArg.isExistsOptionByPattern( /optimize|min(imize)?|prod(uction)?/ ),
      isNoQuote: !!this.handlerArg.isExistsOptionByPattern( /no(\-)?quote/ )
    };

    return {
      options,
      entry: this.handlerArg.getArgByPosition(0),
      output: this.handlerArg.getArgByPosition(2)
    };

  }

};

module.exports = ConfigResolver;
