#! /usr/bin/env node

const
  CliArg = require('./lib/args'),
  handlerArg = new CliArg( {
    preNormalize: function( args ) {

      return args.slice( 2, );
    }
  } ),
  fs = require('fs'),
  ResolveEntry = require('./lib/resolve-entry'),
  onParseFile = require('./lib/onParse'),
  createWatcherParse = require('./lib/onWatchParse'),
  resolverEntryPath = new ResolveEntry,
  normalizePath = require('./lib/normalize-path'),
  checkPathEntry = require('./lib/check-path-entry')
  styleWriting = require('./lib/style-writing'),
  prettyLogs = require('./lib/logs'),
  _pkg = require('./../package.json'),

  isWatch = handlerArg.isExistsOption('watch'),
  isEs6 = handlerArg.isExistsOption('es6'),
  isOptimize = handlerArg.isExistsOptionByPattern( /optimize|min(imize)?|prod(uction)?/ ),
  isNoQuote = handlerArg.isExistsOptionByPattern( /no(\-)?quote/ )
;

if( handlerArg.isExistsArg('version') || handlerArg.isExistsOption('version') ) {

  prettyLogs.info('version: ' + _pkg.version );

	process.exit();
}

ResolveEntry
  .setAllowsTypeFiles([
    "css"
  ])
  .setIsAllowDirectory( true )
;

global.pathEntry = handlerArg.getArgByPosition( 0 );
global.pathOutput = handlerArg.getArgByPosition( 2 );

global.options = {
  isWatch,
  isEs6,
  isOptimize,
  isNoQuote
};

global.prettyLogs = prettyLogs;

// if paths arg exists
const statusCheckPathEntry = checkPathEntry();

if( !statusCheckPathEntry.success ) {

  const {
    isExistsPathEntry,
    isExistsPathOutput,
    message
  } = statusCheckPathEntry;

  prettyLogs.error(
    `${!isExistsPathEntry ? message.entry: ""}${!isExistsPathOutput ? message.output: ""}\n\ne.g > ${prettyLogs.string(global.pathEntry || "./css/index.css")} to ${prettyLogs.string(global.pathOutput || "./dist/index.js")}`
  );

  process.exit( 0 );
}

// normalize paths arg
global.pathEntry = normalizePath({
  root: process.cwd(),
  path: global.pathEntry
});

global.pathOutput = normalizePath({
  root: process.cwd(),
  path: global.pathOutput
});

const isExistsEntry = fs.existsSync( global.pathEntry );

if( !isExistsEntry ) {

  prettyLogs.error( "path entry: " +  prettyLogs.string( pathEntry ) + " not exists" );
  process.exit( 0 );
}

resolverEntryPath.path = global.pathEntry;

if( isWatch ) {

  prettyLogs.info( "mode watch have been enabled\n" );
}

if( !resolverEntryPath.response.success ) {

  prettyLogs.error( resolverEntryPath.response.details );

  process.exit();
}

if( !fs.existsSync( global.pathOutput ) ) {
  fs.mkdirSync( global.pathOutput, {
    recursive: true
  } );
}

console.log( prettyLogs.string( global.pathEntry ) + " > " + prettyLogs.string( global.pathOutput ) + "\n" );

const filesname = resolverEntryPath.response.isDirectory ? resolverEntryPath.response.files.map( filename => (
  resolverEntryPath.response.join( filename )
) ): [global.pathEntry];

prettyLogs.info(`${filesname.length} file.s have been find.s\n`);

if( isWatch ) {

  const onWatchParseFile = createWatcherParse( {
    isDirectory: resolverEntryPath.response.isDirectory
  } );

  filesname.forEach( onWatchParseFile );

} else {

  filesname.forEach( onParseFile );

}
