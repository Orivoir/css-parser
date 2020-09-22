const fs = require('fs');

const CssUnminifier = require('./unminifier');
const CssSepareBlock = require('./separe-block');

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

  static get PROPERTIES_MAP_JSON() {

    return require('./properties-map.meta.json');
  }

  static addAllowSelector( allowSelector ) {

    if( typeof allowSelector === "string" ) {

      CssFileParser.push( allowSelector );
    }

    return CssFileParser;
  }

  static get propertiesToMap() {

    return [
      "padding",
      "margin",
      "border"
    ];

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

    if( /^[\d]{1,}(\.)?[\d]{0,}px/.test(value) ) {

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

    this.unminifier = new CssUnminifier( this.content );
    this.separeBlock = new CssSepareBlock( this.unminifier.content );

    this.stylesheet = {};

    this.separeBlock.blocks.forEach( block => {

      this.selector = CssFileParser.separeSelector(
        this.separeBlock.getSelectorBlock( block )
      )[0];

      const isValidSelector = CssFileParser.ALLOWS_SELECTORS.find( allowSelector => (
        this.selector.indexOf( allowSelector ) === 0
      ));

      this.body = this.separeBlock.getBodyBlock( block );

      if( !isValidSelector ) return;

      if( this.body.indexOf( "@CssParser/Ignore" ) !== -1 ) return;

      this.selector = CssFileParser.normalizeSelector( this.selector, isValidSelector );

      this.body = CssFileParser.parseBody( this.body );

      this.stylesheet[ this.selector ] = {};

      Object.keys( this.body ).forEach( cssValue => {

        const propertyName = this.body[cssValue].property;

        if( CssFileParser.isMapProperty( propertyName ) ) {

          const mapProperty = CssFileParser.getMapOfProperty( propertyName );

          const valuesProperties =  CssFileParser.separeValues( this.body[cssValue].value );

          Object.keys( mapProperty ).forEach( currentPropertyName => {

            const indexValue = mapProperty[ currentPropertyName ][ 0 ];
            const replyValue = mapProperty[ currentPropertyName ][ 1 ];

            if( valuesProperties[ indexValue ] || valuesProperties[ indexValue ] === 0  ) {

              this.write( currentPropertyName, valuesProperties[ indexValue ] );

            } else {

              if( replyValue.type === "value" ) {
                this.write( currentPropertyName, replyValue.value );

              } else {

                if( valuesProperties[ replyValue.value ] || valuesProperties[ replyValue.value ] === 0 ) {

                  this.write( currentPropertyName, valuesProperties[ replyValue.value ]);
                } else {

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

    const scan = fs.statSync( path );

    if( !scan.isFile() ) {

      throw new RangeError("constructor error, arg1: path should be a path from a file");
    }

    this._path = path;

  }

};

module.exports = CssFileParser;
