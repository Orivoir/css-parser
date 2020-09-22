module.exports = function() {

  if( !global.pathEntry || !global.pathOutput ) {

    const isExistsPathEntry = !!global.pathEntry;
    const isExistsPathOutput = !!global.pathOutput;

    const message = {
      entry: "path entry not found\npath entry should be arg1\n",
      output: "path output not found\npath output should be arg2"
    };

    return {
      success: false,
      isExistsPathEntry,
      isExistsPathOutput,
      message
    }

  } else {

    return {
      success: true
    };
  }

};