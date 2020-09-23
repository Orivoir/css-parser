const {expect, assert} = require('chai');

const CssAnnotations = require('./../.bin/lib/css-file-parser/annotations');

describe('class: "./.bin/lib/css-file-parser/annotations.js', () => {

  const factory = require('./factory-data/css-body.annotations');

  factory.forEach( cssBlock => {

    const annotations = CssAnnotations.getAnnotations( cssBlock.content );

    let message = `should contains annotation.s: ${cssBlock.has ? "yes": "no"}`;

    it( message, () => {

      expect( annotations.has() ).to.equal( cssBlock.has );

    } );

    if( cssBlock.has ) {

      message = `should contains annotation with name: "${cssBlock.name}"`;

      it( message, () => {

        assert.isTrue( !!annotations.contains( cssBlock.name ) );
      } );

    }

  } );

} );
