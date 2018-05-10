const path = require('path')

module.exports = {
  mode: 'development',
  entry: './public/js/home.js',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: 'home.bundle.js',
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