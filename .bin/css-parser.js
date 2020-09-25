#! /usr/bin/env node

const
  _pkg = require('./../package.json'),
  CliArg = require('./lib/args'),
  handlerArg = new CliArg( {
    preNormalize: function( args ) {

      return args.slice( 2, );
    }
  } ),
  fs = require('fs'),
  onParseFile = require('./lib/onParse'),
  createWatcherParse = require('./lib/onWatchParse'),
  prettyLogs = require('./lib/logs'),
  generatorConfigFile = require('./lib/generate-preset-config-file')
;

if( handlerArg.isExistsArg('version') || handlerArg.isExistsOption('version') ) {

  prettyLogs.info('version: ' + _pkg.version );
	process.exit();
}

if( handlerArg.isExistsArg('init') ) {

  generatorConfigFile();

  process.exit();
}

const ConfigResolver = require('./lib/resolve-config');
const config = new ConfigResolver( handlerArg );

global.options = config.options;
global.paths = config.paths;

global.prettyLogs = prettyLogs;

const isExistsEntry = fs.existsSync( config.paths.entry );

if( !isExistsEntry ) {

  prettyLogs.error( "path entry: " +  prettyLogs.string( config.paths.entry ) + " not exists" );
  process.exit( 0 );
}

const resolverEntryPath = config.resolverEntryPath;

resolverEntryPath.path = config.paths.entry;

if( config.options.isWatch ) {

  prettyLogs.info( "mode watch have been enabled\n" );
}

if( !resolverEntryPath.response.success ) {

  prettyLogs.error( resolverEntryPath.response.details );
  process.exit();
}

// create directory output if not exists
if( !fs.existsSync( config.paths.output ) ) {

  fs.mkdirSync( config.paths.output, {
    recursive: true
  } );

}

console.log( prettyLogs.string( config.paths.entry ) + " > " + prettyLogs.string( config.paths.output ) + "\n" );

// get files to parses
const filesname = resolverEntryPath.response.isDirectory ? resolverEntryPath.response.files.map( filename => (
  resolverEntryPath.response.join( filename )
) ): [config.paths.entry];

prettyLogs.info(`${filesname.length} file.s have been find.s\n`);

if( config.options.isWatch ) {

  const onWatchParseFile = createWatcherParse( {
    isDirectory: resolverEntryPath.response.isDirectory
  } );

  filesname.forEach( onWatchParseFile );

} else {

  filesname.forEach( onParseFile );
}
