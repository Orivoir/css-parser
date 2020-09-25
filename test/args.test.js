const { assert } = require('chai');

const CliArg = require('./../.bin/lib/args');

const generator = require('./factory-data/handler-argv/hydrate');

const [factoryArgvHydrate, indexGenerated] = generator({ });
const [factoryArgvNotHydrate,] = generator( { excludeValue: indexGenerated } );

const [ factoryOptions, indexOptions ] = generator({
  withOptions: true
});

const [factoryOptionsNotHydrate,] = generator({
  withOptions: true,
  excludeValue: indexOptions
});

// save current argv for re affect after test suited
process.__INIT_ARGV__ = process.argv;

// re affect default argv
process.argv = process.argv.slice( 0, 2 );

describe('class: "./.bin/lib/args.js"', () => {

  // re affect init argv
  after( () => {

    process.argv = process.__INIT_ARGV__;
    delete process.__INIT_ARGV__;

  } );

  describe('is exists argument by name', () => {

    before( () => {

      // push random argv
      process.__DEFAULT_ARGV__ = process.argv;
      process.argv = [...process.argv, ...factoryArgvHydrate];

    } );

    after( () => {
      process.argv = process.__DEFAULT_ARGV__;
      delete process.__DEFAULT_ARGV__;
    } );

    const handlerArgs = new CliArg({
      preNormalize: argv => argv
    });

    factoryArgvHydrate.forEach( realArg => {

      const message = `should exists argument: "${realArg}"`;

      it( message, () => {

        assert.isTrue( !!handlerArgs.isExistsArg( realArg ) );

      } );

    });

    factoryArgvNotHydrate.forEach( fakeArg => {

      const message = `should not exists argument: ${fakeArg} `

      it( message, () => {

        assert.isFalse( !!handlerArgs.isExistsArg( fakeArg ) );

      });

    });

  } );

  describe('is exists argument by pattern', () => {

    before( () => {

      // push random argv
      process.__DEFAULT_ARGV__ = process.argv;

      // remove default system paths inside argv
      // because else should parsed regex builded from string
      process.argv = factoryArgvHydrate;

    } );

    after( () => {
      process.argv = process.__DEFAULT_ARGV__;
      delete process.__DEFAULT_ARGV__;
    } );

    const handlerArgs = new CliArg({
      preNormalize: argv => argv
    });

    factoryArgvHydrate.forEach( realArg => {

      realArg = new RegExp( `^${realArg}$`);
      const message = `should exists argument: ${realArg.source}`;

      it( message, () => {


        assert.isTrue( !!handlerArgs.isExistsArgByPattern( realArg ) );

      } );

    });

    factoryArgvNotHydrate.forEach( fakeArg => {

      fakeArg = new RegExp( `^${fakeArg}$`);
      const message = `should not exists: ${fakeArg.source}`;

      it(message, () => {


        assert.isFalse( !!handlerArgs.isExistsArgByPattern( fakeArg ) );

      });

    });

  } );

  describe('is exists options by name', () => {

    before( () => {

      process.__DEFAULT_ARGV__ = process.argv;
      process.argv = factoryOptions;
    } );

    after( () => {

      process.argv = process.__DEFAULT_ARGV__;
      delete process.__DEFAULT_ARGV__;

    } );

    const handlerArgs = new CliArg({
      preNormalize: argv => argv
    });

    factoryOptions.forEach( optionName => {

      const message = `should exists option: "${optionName}"`;

      it( message, () => {

        assert.isTrue(!!handlerArgs.isExistsOption( optionName ));

      } );

    } );

    factoryOptionsNotHydrate.forEach( optionName => {

      const message = `should not exists option: "${optionName}"`;

      it( message, () => {

        assert.isFalse(!!handlerArgs.isExistsOption( optionName ));

      } );

    } );

  } );

  describe('is exists options by pattern', () => {

    before( () => {

      process.__DEFAULT_ARGV__ = process.argv;
      process.argv = factoryOptions;
    } );

    after( () => {

      process.argv = process.__DEFAULT_ARGV__;
      delete process.__DEFAULT_ARGV__;

    } );

    const handlerArgs = new CliArg({
      preNormalize: argv => argv
    });

    factoryOptions.forEach( optionName => {

      const message = `should exists option: "${optionName}"`;

      it( message, () => {

        const optionregex = new RegExp( `^${optionName}$`, "i" );
        assert.isTrue(!!handlerArgs.isExistsOptionByPattern( optionregex ));

      } );

    } );

    factoryOptionsNotHydrate.forEach( optionName => {

      const message = `should not exists option: "${optionName}"`;

      it( message, () => {

        const optionregex = new RegExp( `^${optionName}$`, "i" );

        assert.isFalse(!!handlerArgs.isExistsOptionByPattern( optionregex ));

      } );

    } );

  } );

} );
