class CssUniminifier {

  // read only
  static get MARKER_OPEN_STYLE() {
    return "<::MARKER_OPEN_STYLE::>";
  }

  // read only
  static get MARKER_CLOSE_STYLE() {
    return "<::MARKER_CLOSE_STYLE::>"
  }

  constructor( content ) {

    this.content = content;

    this.endlines();
    this.bodyStyles();
  }

  bodyStyles() {

    this.content = this.content.split(';').join(';\n');
  }

  endlines() {

    while( this.content.indexOf('{') !== -1 ) {

      this.content = this.content.replace('{',  CssUniminifier.MARKER_OPEN_STYLE + "\n" );
    }
    while( this.content.indexOf(CssUniminifier.MARKER_OPEN_STYLE) !== -1 ) {
      this.content = this.content.replace(CssUniminifier.MARKER_OPEN_STYLE, '{');
    }

    while( this.content.indexOf('}') !== -1 ) {

      this.content = this.content.replace('}', '\n'+CssUniminifier.MARKER_CLOSE_STYLE+'\n');
    }

    while( this.content.indexOf(CssUniminifier.MARKER_CLOSE_STYLE) !== -1 ) {
      this.content = this.content.replace(CssUniminifier.MARKER_CLOSE_STYLE, '}');
    }

  }

}

module.exports = CssUniminifier;
