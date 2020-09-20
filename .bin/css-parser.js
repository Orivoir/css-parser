#! /usr/bin/env node

const
  CliArg = require('./lib/args'),
  handlerArg = new CliArg( {
    preNormalize: function( args ) {

      return args.slice( 2, );
    }
  } ),
  fs = require('fs'),
  pathResolver = require('path'),

  CssFileParser = require('./lib/css-file-parser/parser'),

  ResolveEntry = require('./lib/resolve-entry'),

  resolverEntryPath = new ResolveEntry,

  normalizePath = require('./lib/normalize-path'),

  styleWriting = require('./lib/style-writing'),

  prettyLogs = require('./lib/logs'),
  isWatch = handlerArg.isExistsOption('watch'),
  isEs6 = handlerArg.isExistsOption('es6'),

  isOptimize = handlerArg.isExistsOptionByPattern( /optimize|min(imize)?|prod(uction)?/ ),

  isNoQuote = handlerArg.isExistsOptionByPattern( /no(\-)?quote/ ),

  chokidar = require('chokidar'),

  _pkg = require('./../package.json')
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

// if paths arg exists
if( !global.pathEntry || !global.pathOutput ) {

  const isExistsPathEntry = !!global.pathEntry;
  const isExistsPathOutput = !!global.pathOutput;

  const message = {
    entry: "path entry not found\npath entry should be arg1\n",
    output: "path output not found\npath output should be arg2"
  };

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
) ) : [global.pathEntry];

prettyLogs.info(`${filesname.length} file.s have been find.s\n`);


function onParseFile( filename ) {

  const createStylesheet = new CssFileParser( filename );

  const pathWrite = pathResolver.join(
    global.pathOutput,
    pathResolver.basename(filename).replace( 'css', 'js' )
  );

  styleWriting({
    styles: createStylesheet.stylesheet,
    path: pathWrite,
    isEs6,
    isOptimize,
    isNoQuote
  });

  prettyLogs.success(
    `${pathResolver.basename(filename)} => ${pathWrite}`
  );

}

if( isWatch ) {

  filesname.forEach( filename => {

    const watcher = chokidar.watch( filename );

    watcher.on('change', (path, stat) => {

      prettyLogs.info(`listen rewrite ${path} with size of ${stat.size} octet` )

      onParseFile( path );

    } );

  } );

} else {

  filesname.forEach( onParseFile );

}
