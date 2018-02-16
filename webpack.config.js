const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'client'),
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?__webpack_hmr&timeout=20000&reload=true',
    './index'
  ],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'js/app.bundle.js',
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
