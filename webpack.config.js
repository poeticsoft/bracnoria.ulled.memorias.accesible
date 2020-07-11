const path = require('path')
const fs = require('fs');
var copydir = require('copy-dir');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const EventHooksPlugin = require('event-hooks-webpack-plugin');
const config = require('./config')

module.exports = {
  name: 'main',
  entry: './src/' + config.memory + '/scss/main.scss',
  output: {
    path: config.destpath
  },
  context: __dirname,
  mode: config.mode == 'prod' ? 'production' : 'development',
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [          
          { 
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(woff2?|ttf|otf|eot)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: '[name].[ext]',
          outputPath: '../fonts',
          publicPath: '../fonts'
        }
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: '[name].[ext]',
          outputPath: '../assets',
          publicPath: '../assets'
        }
      }
    ]
  },
  plugins: [
    /*
    new EventHooksPlugin({
      'done': () => {
      }
    }),
    */
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new LiveReloadPlugin({
      protocol: 'http',
      hostname: 'localhost',
      delay: 500,
      appendScriptTag: false
    })
  ],
  resolve: {
    alias: {
      assets: path.resolve(__dirname + '/src/' + config.memory + '/assets'),
      fonts: path.resolve(__dirname + '/src/' + config.memory + '/fonts')
    },
    extensions: ['.js', '.jsx']
  }
}