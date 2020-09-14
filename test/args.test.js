const
  {assert, expect} = require('chai'),
  CliArg = require('./../.bin/lib/args'),
  factoryData = require('./factory-data/args.json')
;

// clear args append by run test command
beforeEach( () => {

  process.argv = process.argv.slice( 2, );

} );

describe('class `CliArg`', () => {

  it('typeof should be a function', () => {

    assert.isFunction( CliArg )

  } );

  it('args should be empty array', () => {

    const instance = new CliArg;

    assert.isArray( instance.args );

    expect( instance.args ).to.be.lengthOf( 0 );

  } );

  describe('args and options should be exactly:', () => {

    factoryData.forEach( attempt => {

      const message = `with push: "${attempt.push.join(', ')}"`

      it(message, () => {

        const lastArgv = process.argv;

        process.argv = [...lastArgv, ...attempt.push];

        const instance = new CliArg;

        assert.isArray( instance.args );
        expect( instance.args ).to.be.lengthOf( attempt.args.length );

        assert.isArray( instance.options );
        expect( instance.options ).to.be.lengthOf( attempt.options.length );

        process.argv = lastArgv;

      } );

    } );

  } );

} );