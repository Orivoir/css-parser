const { assert, expect } = require('chai');

const dash2camel = require('./../.bin/lib/dash2camel');

describe('module: ./.bin/lib/dash2camel.js', () => {

  const factory = require('./factory-data/dash2camel.json');

  it('should be a function', () => {

    assert.isFunction( dash2camel );

  } );

  factory.functionals.forEach( attempt => {

    const message = `should return: "${attempt.output}"`;

    it( message, () => {

      expect( dash2camel( attempt.entry ) ).to.equal( attempt.output );

    } );

  } );

  factory.throws.forEach( _throw => {

    const message = `should throw RangeError for arg: ${_throw}`;

    it( message, () => {

      const fxThrow = () => dash2camel( _throw )

      expect( fxThrow ).to.throw( RangeError, "arg1: dashValue, should be a string value" );

    } );

  } )

} );
