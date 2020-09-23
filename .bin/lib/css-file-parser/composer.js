/**
 * resolve annotation @CssParser/Compose
 * copy styles from composes to target
 * this class is a other approach about Stylesheet compose of react native (https://reactnative.dev/docs/stylesheet#compose)
 */
class CssComposer {

  constructor() {

    this.items = [];
  }

  add( item ) {

    this.items.push( item );
  }

  generate( style ) {

    this.items.forEach( ({selector, composes}) => {

      const target = style[ selector ];

      const cores = composes.map( compose => (
        style[ compose ]
      ) );

      // upgrade target with cores style
      cores.forEach( core => {

        Object.keys( core ).forEach( property => {

          if( typeof target[ property ] !== "undefined" ) {
            // target have priority on properties composed
            return;
          }

          target[ property ] = core[ property ];

        } );

      } );

      style[ selector ] = target;

    } );

    return style;
  }

};

module.exports = CssComposer;
