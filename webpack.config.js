const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    home: './public/js/home',
    hobbit: './public/js/hobbit'
  },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  context: __dirname
}