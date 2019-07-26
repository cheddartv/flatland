const path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    port: 4007,
    // compress: true
  },
  //plugins: [ new MinifyPlugin({}, {}) ],
  output: {
    filename: 'flatland.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'flatland',
    libraryTarget: 'umd'
  },
  externals: {
    react: 'react',
    classnames: 'classnames',
  },
  resolve: {
    alias: {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  },
  module: {
    rules: [
      {
        use: {
          loader:'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-2']
          }
        },
        test: /\.js$/,
        exclude: /node_modules/
      },
    ]
  }
}
