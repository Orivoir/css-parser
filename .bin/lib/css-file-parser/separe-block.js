class CssSepareBlock {

  constructor( content ) {

    this.content = content;

    this.blocks = this.content.split('}').map( block => {

      block = block.trim();
      block += "\n}";

      return block;
    } );

  }

  getSelectorBlock( block ) {

    block = block.replace( this.getBodyBlock( block ), "" );
    return block.trim();
  }

  getBodyBlock( block ) {

    const openBody = block.indexOf( '{' );
    const closeBody = block.indexOf( '}' ) + 1;

    return block.slice( openBody, closeBody );
  }

};


module.exports = CssSepareBlock;
