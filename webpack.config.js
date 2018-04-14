var path = require('path');

module.exports = {
  entry: [
    './src/app'
  ],
  output: {
      publicPath: '/',
      filename: 'demo/bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader'
      }
    ]
  }
};