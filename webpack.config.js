const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval',
  entry: {
    'react-flip': path.resolve(__dirname, 'demo/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'demo')
        ],
        loader: 'eslint-loader',
        options: {
          emitError: true
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'demo')
        ],
        oneOf: [
          {
            resourceQuery: /\?raw/,
            loader: 'raw-loader'
          },
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        loader: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(__dirname, 'demo/index.html'),
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    })
  ],
  devServer: {
    historyApiFallback: true
  }
};
