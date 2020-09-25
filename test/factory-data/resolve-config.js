module.exports = {

  json: [
    {
      filename: "factory-config-0.json",
      content: require('./resolve-config/factory-config-0.json'),
      options: {
        isEs6: true,
        isNoQuote: true,
      },
      entry: {
        isDirectory: true,
        files: [
          "a.css",
          "b.css"
        ],
      }
    },
    {
      filename: "factory-config-1.json",
      content: require('./resolve-config/factory-config-1.json'),
      options: {
        isEs6: true,
      },
      entry: {
        isDirectory: true,
        files: [
          "b.css",
          "c.css"
        ],
      }
    }
  ],

  js: [
    {
      filename: "factory-config-0.js",
      content: require('./resolve-config/factory-config-0'),
      options: {
        isOptimize: true,
      },
      entry: {
        isDirectory: true,
        files: [
          "a.css",
          "b.css"
        ],
      }
    },
    {
      filename: "factory-config-1.js",
      content: require('./resolve-config/factory-config-1'),
      options: {
        isNoQuote: true,
      },
      entry: {
        isDirectory: true,
        files: [
          "b.css",
          "c.css"
        ],
      }
    }
  ]
}
