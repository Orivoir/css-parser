const chokidar = require('chokidar');
const onParseFile = require('./onParse');

function addFileWatcher( filename ) {

  const watcherFile = chokidar.watch( filename );

  watcherFile.on('change', (path, stat) => {

    // prettyLogs.info(`listen rewrite ${path} with size of: ${stat.size} octets` );

    onParseFile( path );

  } );

  watcherFile.on('unlink', path => {

    watcherFile.close()
    .then( () => {
      global.prettyLogs.info(`file: ${path} have been removed`);
    } )
    .catch( error => {

      console.log( error );

      throw "Internal error, watcher files memory leaks";

    } );

  } );

}

module.exports = function({
  isDirectory
}) {

  if( isDirectory ) {

    // listen add new file
    const watcherDirectory = chokidar.watch( global.pathEntry );

    watcherDirectory.on('add', path => {

      prettyLogs.info(`file: ${path} have been added`);
      addFileWatcher( path );

    } );

  }

  return filename => {

    addFileWatcher( filename );

  };

};
