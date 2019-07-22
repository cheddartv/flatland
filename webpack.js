const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    port: 4007,
    compress: true
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
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
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};
