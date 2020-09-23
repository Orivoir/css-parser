const { assert, expect } = require('chai');

const CliArg = require('./../.bin/lib/args');

const [factoryArgvHydrate, indexGenerated] = require('./factory-data/handler-argv/hydrate')({ });
const [factoryArgvNotHydrate,] = require('./factory-data/handler-argv/hydrate')( { excludeValue: indexGenerated } );

describe('class: "./.bin/lib/args.js"', () => {

  // hydrate argv

  // re affect default argv
  process.argv = process.argv.slice( 0, 2 );

  // push random argv
  process.argv = [...process.argv, ...factoryArgvHydrate];

  describe('is exists argument by name', () => {

    const handlerArgs = new CliArg({
      preNormalize: argv => argv
    });

    process.argv.forEach( realArg => {

      it( 'should exists', () => {

        assert.isTrue( !!handlerArgs.isExistsArg( realArg ) );

      } );

    });

    factoryArgvNotHydrate.forEach( fakeArg => {

      it('should not exists', () => {

        assert.isFalse( !!handlerArgs.isExistsArg( fakeArg ) );

      });

    });

  } );

  describe('is exists argument by pattern', () => {

    const handlerArgs = new CliArg({
      preNormalize: argv => argv
    });

    // remove default system paths inside argv
    // because else should parsed regex builded from string
    process.argv.slice( 2, ).forEach( realArg => {

      it( 'should exists', () => {

        realArg = new RegExp( `^${realArg}$`);

        assert.isTrue( !!handlerArgs.isExistsArgByPattern( realArg ) );

      } );

    });

    factoryArgvNotHydrate.forEach( fakeArg => {

      it('should not exists', () => {

        fakeArg = new RegExp( `^${fakeArg}$`);

        assert.isFalse( !!handlerArgs.isExistsArgByPattern( fakeArg ) );

      });

    });

  } );

} );
