const blocks = [
  {
    content: `
      .a {
        color: red;
      }
    `,
    has: false
  }, {
    content: `
      .foobar {
        color: red;
        /**
         * @Abc = 42
         */
      }
    `,
    name: "Abc",
    has: true
  }, {
    content: `
    .foobar {
      letter-spacing: .09rem;
      /**
       * @Foobar = 42
       */
      color: red;
    }
    `,
    has: true,
    name: "Foobar"
  }, {
    content: `
    .a-b {
      margin: 2px
      /* hi world */
      color: red;
    }
    `,
    has: false
  }
];

module.exports = blocks;
