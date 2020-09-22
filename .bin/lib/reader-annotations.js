/**
 * This file is a part of package: class-annotation (https://www.npmjs.com/package/class-annotations)
 * @license ISC
 * @version 0.9.4-beta
 */

class ReaderAnnotations {

  static validSeparators = [
      '=',
      ':',
      '=>',
      '=:',
      '('
  ];

  constructor(
    lines,
    classname
  ) {

    this.lines = lines.slice( 1, -1 );

    this.worker = null;
    this.classname = classname;

    this.init();
  }

  init() {

    this.currentMultiline = "";
    this.isMultiLine = false;
    this.currentMultilineKey = null;

    this.data = {
      excludes: []
    };

    this.resolveLines();

    this.data.excludes = this.data.excludes.filter( exclude => !!exclude.length );

    this.cleanOutput();
  }

  resolveLines() {

    this.lines.forEach( ( line, lineNumber ) => {

      line = line.replace('*', '').trim();
      this.worker = line;

      if( this.isArobase || this.isMultiLine ) {

          if( this.isMultiLine ) {

            this.execOneMultiline( lineNumber );
          }

          if( this.canMultiLine ) {

            this.prepareMultiline( lineNumber );

          } else if(
            !this.isMultiLine &&
            this.keyName.trim().length /* because can be an empty line closed from last multiline */
          ) {
            // here: one shot one line
            this.oneLine( lineNumber );
          }

      } else {
        // ecludes value
        // this line is an brut commentary
        this.data.excludes.push( this.worker );
      }

    } );
  }

  get canMultiLine() {

    return this.worker.replace( "@"+this.keyName, '' ).trim().charAt(0) === "(";
  }

  prepareMultiline( lineNumber ) {

    const rv = this.rValueBrut.trim().slice( 1, );
    const isEndLine =  rv[ rv.length - 1 ] === ")";

    this.currentMultilineKey = this.keyName;

    if( !isEndLine ) {

      this.isMultiLine = true;
      this.currentMultiline = rv;
    } else {

      this.oneLine( lineNumber );
    }
  }

  execOneMultiline( lineNumber ) {

    let v = this.worker;
    const isEndLine =  v[ v.length - 1 ] === ")";

    if( isEndLine ) {

      this.isMultiLine = false;
      v = v.slice( 0, -1 );
    }

    this.currentMultiline += v;

    if( isEndLine ) {

      this.data[ this.currentMultilineKey ] = {

          valueBrut: this.currentMultiline.trim()
      };

      const data = this.persistDataType(
          this.data[ this.currentMultilineKey ].valueBrut,
          lineNumber
      );

      this.data[ this.currentMultilineKey ].value = data;

      this.currentMultiline = "";
      delete this.currentMultilineKey;
    }
  }

  oneLine( lineNumber ) {

    if( this.keyName.trim().length ) {

      const keyName = this.keyName;

      this.data[ keyName ] = {
          valueBrut: this.rValue
      };

      const data = this.persistDataType(  this.data[ keyName ].valueBrut,lineNumber );

      this.data[ keyName ].value = data;
    }
  }

  persistDataType( brutData, lineNumber ) {

    let back = undefined;

    try {

        back = eval( '() => (' + brutData + ')')();

    } catch( Exception ) {

    }

    if( back === undefined &&
        brutData !== "undefined"
    ) {
        back = "Parse Error to line: " + (lineNumber+1) + " after opened annotations of class: "+ this.classname +", error: " + brutData + "...";
    }

    return back;

  }

  cleanOutput() {

    // persist only final data

    if( !this.data.excludes.length ) {

      delete this.data.excludes;
    }

    delete this.worker;
    delete this.lines;
    delete this.isMultiLine;
    delete this.currentMultiline;
    delete this.classname;

    return this;
  }

  removeSeparatorFromRvalue( rValueBrut ) {

    let separator = null;

    ReaderAnnotations.validSeparators.forEach( sep => (
        rValueBrut.indexOf( sep ) !== -1 ? separator = sep: null
    ) );

    if( !separator ) {

      return rValueBrut;
    }

    if( separator !== '(' ) {

      return rValueBrut.replace(separator, "").trim();
    }

    return rValueBrut.trim().slice( 1, -1 ).trim();

  }

  get rValue() {

    const keyName = this.keyName;

    let start = this.worker.slice( 1,  );

    let rValueWithSeparator = start.replace( keyName, "" ).trim();

    return this.removeSeparatorFromRvalue( rValueWithSeparator );
  }

  get rValueBrut() {
      // natural right value have not remove separator
      // for can remote separator value

      const keyName = this.keyName;

      let start = this.worker.slice( 1,  );

      let rValueWithSeparator = start.replace( keyName, "" ).trim();

      return rValueWithSeparator;
  }

  get isArobase() {

    // is start line value
    return ( this.worker.charAt( 0 ) === "@" );
  }

  get keyName() {

    // remote keyname of start line value

    let start = this.worker.slice( 1, );

    let i = 0;

    let back = "";

    let isValidCharName = "azertyuiopqsdfghjklmwxcvbn_0123456789/";

    while(
        isValidCharName.includes( start.charAt( i ).toLocaleLowerCase() ) &&
        i < ( start.length - 1 )
    ) {

        back += start.charAt( i++ );
    }

    return back;
  }

};

module.exports = ReaderAnnotations;