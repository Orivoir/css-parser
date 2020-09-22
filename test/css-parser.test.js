const { assert, expect } = require('chai');

const CssFileParser = require('./../.bin/lib/css-file-parser/parser');

const pathResolver = require('path');

const ROOT_FILE_2_PARSE = pathResolver.join( __dirname, "./factory-data/css-to-parse/" );

describe('class: "./.bin/lib/css-file-parser/parser.js"', () => {

  const factory = require('./factory-data/css-to-parse/css.meta.json');

  factory.files.forEach(file => {

    const relativePathFile = file.path;

    const absolutePathFile = pathResolver.join( ROOT_FILE_2_PARSE, relativePathFile );

    if( !file.isExists ) {

      it('should RangeError path not exists', () => {

        const throwRangeError = () => new CssFileParser( absolutePathFile );

        expect( throwRangeError ).have.throw( RangeError, "constructor error, arg1: path, should be a path string value and should exists" );
      } );

    } else {

      if( file.isSkip ) {

        it('should skip file extension invalid', () => {
          const parser = new CssFileParser( absolutePathFile );
          assert.isFalse( parser.isValidExtension );
        } );
      } else {

        const parser = new CssFileParser( absolutePathFile );

        it('should not skip file', () => {
          assert.isTrue( parser.isValidExtension );

        } )

        const styles = parser.stylesheet;

        it('should have build styles result', () => {

          assert.isObject( styles );

        } );

        Object.keys( file.result ).forEach( selector => {

          const message = `should have selector: "${selector}"`;

          describe( message, () => {

            expect( styles ).has.property( selector );

            Object.keys( file.result[ selector ] ).forEach( property => {

              let message = `should have property: "${property}"`;

              it( message, () => {

                expect( styles[selector] ).has.property( property );

              } );

              message = `should have value: "${file.result[selector][property]}"`;

              it( message, () => {

                  expect( styles[selector][property] ).is.equal( file.result[selector][property] );

              } );


            } );

          } );

        } );
      }

    }

  });

} );
