module.exports = {
    entry: "./src/index.js",
    mode: "production",
    optimization: {
      minimize: false
    },
    performance: {
      hints: false
    },
    output: {
      path: __dirname + "/dist",
      publicPath: "dist",
      filename: "worker.js"
    }
  };
  