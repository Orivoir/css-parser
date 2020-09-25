const {expect, assert} = require('chai');

const ResolverConfig = require('./../.bin/lib/resolve-config');
const HandlerArg = require('./../.bin/lib/args');

const factory = require('./factory-data/resolve-config');

describe('class: "./.bin/lib/resolve-config.js"', () => {

  after( () => {

    process.argv = process.__DEFAULT_ARGV__;
  } );

  before( () => {

    process.__DEFAULT_ARGV__ = process.argv;
    process.argv = [];

  } );

  describe('json config file', () => {

    factory.json.forEach( jsonConfig => {

      process.argv = [ ("./test/factory-data/resolve-config/" + jsonConfig.filename) ];

      const handlerArgs = new HandlerArg( {
        preNormalize: args => args
      } );

      const rc = new ResolverConfig( handlerArgs );

      let describeMessage = `entry file finds from: "${jsonConfig.filename}":`

      describe( describeMessage, () => {

        const files = rc.resolverEntryPath.response.files;
        const awaitFiles = jsonConfig.entry.files;

        awaitFiles.forEach( filename => {

          const message = `should find file to parse: ${filename}`;

          it( message, () => {

            assert.isTrue( files.includes( filename ) );

          } );

        } );

      } );

      describeMessage = `options finds from: "${jsonConfig.filename}"`;

      describe(describeMessage, () => {

        Object.keys( rc.options ).forEach( optionName => {

          const message = `should be option: ${optionName} => ${rc.options[optionName]}`;

          it( message, () => {

            expect( rc.options[optionName] ).to.be.equal( jsonConfig.options[optionName] );

          } );

        } );

      } );

    } );

  } );

  describe('js config file', () => {

    factory.js.forEach( jsConfig => {

      process.argv = [ ("./test/factory-data/resolve-config/" + jsConfig.filename) ];

      const handlerArgs = new HandlerArg( {
        preNormalize: args => args
      } );

      const rc = new ResolverConfig( handlerArgs );

      let describeMessage = `entry file finds from: "${jsConfig.filename}":`

      describe( describeMessage, () => {

        const files = rc.resolverEntryPath.response.files;
        const awaitFiles = jsConfig.entry.files;

        awaitFiles.forEach( filename => {

          const message = `should find file to parse: ${filename}`;

          it( message, () => {

            assert.isTrue( files.includes( filename ) );

          } );

        } );

      } );

      describeMessage = `options finds from: "${jsConfig.filename}"`;

      describe(describeMessage, () => {

        Object.keys( rc.options ).forEach( optionName => {

          const message = `should be option: ${optionName} => ${rc.options[optionName]}`;

          it( message, () => {

            expect( rc.options[optionName] ).to.be.equal( jsConfig.options[optionName] );

          } );

        } );

      } );

    } );

  } );

} );
