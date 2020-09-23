const fs = require('fs');
const pathResolver = require('path');

const CssUnminifier = require('./unminifier');
const CssSepareBlock = require('./separe-block');
const CssAnnotations = require('./annotations');
const CssComposer = require('./composer');

/**
 * transform css file to Javascript object
 * develop for usage with: Stylesheet component of react-native
 * https://reactnative.dev/docs/stylesheet
 */
class CssFileParser {

  // parse only below css selectors
  static ALLOWS_SELECTORS = [
    "."
  ];

  static setAllowsSelectors( allowsSelectors ) {

    if( allowsSelectors instanceof Array ) {

      CssFileParser.ALLOWS_SELECTORS = allowsSelectors;
    } else if( typeof allowsSelectors === "string" ) {

      CssFileParser.push( allowsSelectors );
    }

    return CssFileParser;
  }

  static addAllowSelector( allowSelector ) {

    if( typeof allowSelector === "string" ) {

      CssFileParser.push( allowSelector );
    }

    return CssFileParser;
  }

  static get PROPERTIES_MAP_JSON() {

    return require('./properties-map.meta.json');
  }

  static get propertiesToMap() {

    return [
      "padding",
      "margin",
      "border"
    ];

  }

  static get PATTERN_IS_PX_VALUE() {

    return /^[\d]{1,}(\.)?[\d]{0,}px/;
  }

  static get PATTERN_ONLY_NUMBER() {

    return /^[\d]{0,}(\.)?[\d]{1,254}$/;
  }

  static isMapProperty( propertyName ) {

    return CssFileParser.propertiesToMap.includes( propertyName );
  }

  static getMapOfProperty( propertyName ) {

    return CssFileParser.PROPERTIES_MAP_JSON[ propertyName ] || null;
  }

  static separeValues( values ) {

    return values.trim().split(' ');
  }

  static transformValue( value ) {

    if( CssFileParser.PATTERN_IS_PX_VALUE.test(value) ) {

      return parseFloat( value );
    } else if( CssFileParser.PATTERN_ONLY_NUMBER.test( value ) ) {

      return parseFloat( value );

    } else {

      return value;
    }
  }

  write( property, value ) {

    this.stylesheet[ this.selector ][ property ] = CssFileParser.transformValue(value);

  }

  constructor( path ) {

    this.path = path;

    this.content = fs.readFileSync(
      this.path,
      {
        encoding: "utf-8"
      }
    );

    if( !this.isValidExtension ) {
      // file have been skip because file extension should be "css"
      return;
    }

    this.unminifier = new CssUnminifier( this.content );
    this.separeBlock = new CssSepareBlock( this.unminifier.content );
    this.composer = new CssComposer;

    this.stylesheet = {};

    // loop css blocks
    this.separeBlock.blocks.forEach( block => {

      // get selector of current css block
      this.selector = CssFileParser.separeSelector(
        this.separeBlock.getSelectorBlock( block )
      )[0];

      const isValidSelector = CssFileParser.ALLOWS_SELECTORS.find( allowSelector => (
        this.selector.indexOf( allowSelector ) === 0
      ));

      // extract properties of current css block
      this.body = this.separeBlock.getBodyBlock( block );

      if( !isValidSelector ) {
        // current css block have been aborted
        // the selector can be valid but not allowed from: CssFileParser.ALLOWS_SELECTORS | string[]
        return;
      }

      this.selector = CssFileParser.normalizeSelector( this.selector, isValidSelector );

      const annotations = CssAnnotations.getAnnotations( this.body );

      if( annotations.has() ) {
        // current css block contains one or many annotations

        if( annotations.contains( CssAnnotations.IGNORE ) ) {
          // current css block have been aborted
          // because user have explicit ask from a annotation
          return;
        }

        const composeAnnotation = annotations.contains( CssAnnotations.COMPOSE );

        if( composeAnnotation ) {

          this.composer.add({
            selector: this.selector,
            composes: composeAnnotation.valueParsed
          });

        }

      }

      // parse body of current css block
      this.body = CssFileParser.parseBody( this.body );

      this.stylesheet[ this.selector ] = {};

      // loop css properties of current css block
      Object.keys( this.body ).forEach( cssValue => {

        const propertyName = this.body[cssValue].property;

        // if current property should be mapped
        if( CssFileParser.isMapProperty( propertyName ) ) {

          const mapProperty = CssFileParser.getMapOfProperty( propertyName );

          const valuesProperties =  CssFileParser.separeValues( this.body[cssValue].value );

          // loop maps of current property
          Object.keys( mapProperty ).forEach( currentPropertyName => {

            const indexValue = mapProperty[ currentPropertyName ][ 0 ];
            const replyValue = mapProperty[ currentPropertyName ][ 1 ];

            // if value is explicit define
            if( valuesProperties[ indexValue ] || valuesProperties[ indexValue ] === 0  ) {

              this.write( currentPropertyName, valuesProperties[ indexValue ] );

            } else {

              // check if default value exists

              if( replyValue.type === "value" ) {
                this.write( currentPropertyName, replyValue.value );
              } else {

                if( valuesProperties[ replyValue.value ] || valuesProperties[ replyValue.value ] === 0 ) {

                  this.write( currentPropertyName, valuesProperties[ replyValue.value ]);
                } else {

                  // default value not exists for current map property

                  const realPropertyName = propertyName;

                  console.log(`during map of property: "${realPropertyName}" from selector: "${this.selector}", the value for sub property: "${currentPropertyName}", have not been find.\nParse have been stopped, you should fix above error before re run parse style`);
                  throw 'Oops, css value invalid.';
                }
              }
            }

          } );

        } else {

          this.write( this.body[cssValue].property, this.body[cssValue].value );
        }

      } );

      this.stylesheet = this.composer.generate( this.stylesheet );

    });

  }

  static transformPropertyName( propertyName ) {

    if( propertyName.indexOf('-') === -1 ) return propertyName;

    let copy = '';

    let isFired = false;

    for( let i = 0, size= propertyName.length; i < size; i++ ) {

      if( propertyName[ i ] === "-" ) {

        isFired = true;

      } else {

        if( isFired ) {

          copy += propertyName[i].toLocaleUpperCase();

          isFired = false;
        } else {

          copy += propertyName[i];
        }
      }
    }

    return copy;
  }

  static parseBody( body ) {

    body = body.replace('{', '');
    body = body.replace('}', '');

    body = body.split('\n').map( directive => (
      directive.split(':')
    ) )
    .filter( instruction => (
      !!instruction[0] && !!instruction[1]
    ) )
    .map( instruction => (
      {
        property: CssFileParser.transformPropertyName(instruction[0].trim()),
        value: instruction[1].replace(';','').trim()
      }
    ) ).filter( cssValue => (
      !!cssValue.property
    ) )

    return body;

  }

  static normalizeSelector( quantificator, selectorType ) {

    while( quantificator.indexOf( selectorType ) !== -1 ) {

      quantificator = quantificator.replace( selectorType, "" );
    }

    while( quantificator.indexOf(' ') !== -1 ) {

      quantificator = quantificator.replace(' ', '_');
    }

    return quantificator;
  }

  static separeSelector( selector ) {

    return selector.split(',');
  }

  get path() {
    return this._path;
  }

  set path(path) {

    if(
      typeof path !== "string" ||
      !fs.existsSync( path )
    ) {
      throw new RangeError('constructor error, arg1: path, should be a path string value and should exists');
    }

    const filename = pathResolver.basename( path );

    const ext = filename.split('.').slice( -1 )[0].toLocaleLowerCase();


    this.isValidExtension =  ( ext === "css" ) ;

    const scan = fs.statSync( path );

    if( !scan.isFile() ) {

      throw new RangeError("constructor error, arg1: path should be a path from a file");
    }

    this._path = path;

  }

};

module.exports = CssFileParser;
