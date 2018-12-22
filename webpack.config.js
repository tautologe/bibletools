const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    compareBooks: './src/app/compareBooks.js',
    compareStrongs: './src/app/compareStrongs.js',
    strong: './src/app/strong.js'
  },
  output: {
      publicPath: '/',
      filename: '[name].js'
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
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/**/*.html', to: '.', flatten: true },
      { from: './src/style.css', to: '.', flatten: true }
    ])
  ]
};