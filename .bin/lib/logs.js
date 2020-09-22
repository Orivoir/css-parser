const   chalk = require('chalk');

module.exports = {

  error: message => {

    console.log(
      chalk`{bold.red [error]} ${message}`
    );

  },

  string: value => {
    return chalk`{yellow "${value}"}`;
  },

  info: message => {

    console.log(
      chalk`{bold.cyan [helper]} ${message}`
    );
  },

  success: message => {

    console.log(
      chalk`{bold.green [success]} ${message}`
    );
  }

};
