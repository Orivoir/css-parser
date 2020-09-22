class CssAnnotations {

  static get IGNORE() {

    return "@CssParser/Ignore";
  }

  /**
   * @return string[] - get list of annotations cant contains var.s
   */
  static get STATIC() {

    return [
      {
        name: CssAnnotations.IGNORE,
        describe: "define inside body css block ignore this css block"
      }
    ];
  }

  static has( cssBody ) {

    const hasStatic = CssAnnotations.STATIC.find( staticAnnotation => {

      return cssBody.indexOf( staticAnnotation.name ) !== -1;

    } );

    return typeof hasStatic === "object" ? hasStatic.name: null;

  }

};

module.exports = CssAnnotations;
