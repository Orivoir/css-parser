const fs = require('fs');
const pathResolver = require('path');

class ResolverEntry {

  static IS_ALLOW_DIRECTORY = true;
  static ALLOWS_TYPE_FILES = [];

  static setIsAllowDirectory( isAllowDirectory ) {

    ResolverEntry.IS_ALLOW_DIRECTORY = !!isAllowDirectory;

    return ResolverEntry;
  }

  static getIsAllowDirectory() {

    return ResolverEntry.IS_ALLOW_DIRECTORY;
  }

  static setAllowsTypeFiles( allowsTypeFiles ) {

    if( typeof allowsTypeFiles === "string" ) {

      ResolverEntry.ALLOWS_TYPE_FILES.push( allowsTypeFiles );
    } else if( allowsTypeFiles instanceof Array ) {

      ResolverEntry.ALLOWS_TYPE_FILES = allowsTypeFiles;
    }

    return ResolverEntry;
  }

  static getAllowsTypeFiles() {

    return ResolverEntry.ALLOWS_TYPE_FILES;
  }

  static addAllowsTypeFile( allowTypeFile ) {

    if( typeof allowTypeFile === "string" ) {

      ResolverEntry.ALLOWS_TYPE_FILES.push( allowTypeFile );
    }

    return ResolverEntry;
  }

  static removeAllowsTypeFile( allowTypeFile ) {

    if( typeof allowTypeFile === "string" ) {

      ResolverEntry.ALLOWS_TYPE_FILES = ResolverEntry.ALLOWS_TYPE_FILES.filter( currentAllowTypeFile => (
        currentAllowTypeFile !== allowTypeFile
      ) );

    } else if( typeof allowTypeFile === "number" ) {

      const index = parseInt( allowTypeFile );

      if( typeof ResolverEntry.ALLOWS_TYPE_FILES[ index ] === "string" ) {

        ResolverEntry.ALLOWS_TYPE_FILES = ResolverEntry.ALLOWS_TYPE_FILES.filter( (_,currentIndex) => (
          currentIndex !== index
        ) );

      }
    }

    return ResolverEntry;
  }

  constructor( path ) {

    if( typeof path === "string" ) {

      this.init( path );
    }
  }

  get type() {

    if( !this.isInit ) {
      return null;
    }

    return this.getTypeOf( this.path );
  }

  init( path ) {

    this.isInit = true;
    this.isFinish = false;
    this.response = {
      success: null,
      isFile: null,
      isDirectory: null,

      join: filename => {

        return pathResolver.join( this.path, filename )
      }
    };

    this.path = path;

    if( !this.isFinish ) {

      this.findType();

      if( !this.isFinish ) {

        if( ResolverEntry.IS_ALLOW_DIRECTORY ) {

          this.response.files = this.getFiles();
          this.response.success = true;
          this.isFinish = true;
        }

      } else {

        this.response.success = true;
      }

    } else {

      this.isFinish = true;

      if( this.response.success === null ) {
        this.response.success = true;
      }
    }

  }

  getTypeOf( filename ) {

    return filename.split('.').slice( -1 )[0];
  }

  getFiles() {

    return fs.readdirSync( this.path, {
      withFileTypes: true,
      encoding: "utf-8"
    } )
    .map(  dirent => (
      typeof dirent === "object" ? dirent.name: dirent
    ))
    .filter( elementName => {

      const isFile = this.isFile(
        pathResolver.join( this.path, elementName )
      );

      let isAllowTypeFile = null;

      if( isFile ) {

        const type = this.getTypeOf( elementName );
        isAllowTypeFile = ResolverEntry.ALLOWS_TYPE_FILES.find( allowTypeFile => allowTypeFile === type );
      }

      return isFile && isAllowTypeFile;

    } );

  }

  isFile( path ) {

    return fs.statSync( path ).isFile();
  }

  findType() {

    const stat = fs.statSync( this.path );

    this.response.isFile = stat.isFile();
    this.response.isDirectory = stat.isDirectory();

    if( this.response.isFile ) {

      this.isFinish = true;
    }

  }

  details( message ) {

    this.response.details = message;
    return this;
  }

  get path() {
    return this._path;
  }
  set path(path) {

    if( !this.isInit ) {

      this.init( path );
    }

    if( typeof path !== "string" ) {
      this.response.success = false;
      this.details( "path entry should be a string value" );
    } else {

      if( fs.existsSync( path ) ) {
        this._path = path;
      } else {
        this.response.success = false;
        this.details("path entry not exists");
      }
    }

    if( !this._path ) {

      this.isFinish = true;
    }
  }

};

module.exports = ResolverEntry;
