const   chalk = require('chalk');

module.exports = {

  error: message => {

    console.log(
      chalk`{bold.red Oops} ${message}`
    );

  },

  string: value => {
    return chalk`{yellow "${value}"}`;
  },

  info: message => {

    console.log(
      chalk`{bold.cyan helper} ${message}`
    );
  },

  success: message => {

    console.log(
      chalk`{bold.green Success} ${message}`
    );
  }

};
