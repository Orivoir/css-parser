const ReaderAnnotations = require('./../reader-annotations');

class CssAnnotations {

  /**
   *
   * @param {string} cssBody - complet css block
   * @return array|Annotation - annotations read from css block
   */
  static getAnnotations( cssBody ) {

    const ra = CssAnnotations.read( cssBody );

    const annotations = [];

    annotations.contains = CssAnnotations.contains.bind( annotations );
    annotations.has = CssAnnotations.has.bind( annotations );

    if( typeof ra.data === "object" ) {

      Object.keys( ra.data ).forEach( annotationName => {

        annotations.push({
          name: annotationName,
          value: ra.data[annotationName].valueBrut,
          valueParsed: ra.data[annotationName].value
        });

      } );

    }

    return annotations;
  }

  static read( bodyCss ) {

    const ra = new ReaderAnnotations(
      bodyCss.split('\n'),
      "css file"
    );

    return ra;
  }

  static get IGNORE() {

    return "CssParser/Ignore";
  }

  static get COMPOSE() {

    return "CssParser/Compose"
  }

  static has() {

    const annotations = this;

    if( !annotations )
      return false;

    return annotations.length > 0;
  }

  static contains( annotationName ) {

    const annotations = this;

    if( !annotations ) {
      return false;
    }

    return annotations.find( annotation => (
      annotation.name === annotationName
    ) );

  }

};

module.exports = CssAnnotations;
