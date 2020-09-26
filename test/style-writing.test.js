const {expect} = require('chai');

const styleWriting = require('./../.bin/lib/style-writing');

const pathResolver = require('path');

const ROOT_GENERATE_FILES = pathResolver.join(
  __dirname,
  "./factory-data/style-writing/generate-files"
);

const factory = require('./factory-data/style-writing/style-writing.json');

describe('module: ./.bin/lib/style-writing.js', () => {

  factory.forEach( call => {

    call.entry.path = pathResolver.join( ROOT_GENERATE_FILES, call.entry.path );

    styleWriting(call.entry);

    const generatedJs = require( call.entry.path );

    const message = `generated file should exactly equal to styles entry`;

    it( message, () => {

      expect(generatedJs).to.deep.equal( call.entry.styles );

    } );

  } );

} );