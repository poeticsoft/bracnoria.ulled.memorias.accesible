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
    path: path.join(__dirname, config.compilepath, config.memory)
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
          outputPath: 'fonts',
          publicPath: 'fonts'
        }
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: '[name].[ext]',
          outputPath: 'assets',
          publicPath: 'assets'
        }
      }
    ]
  },
  plugins: [
    new EventHooksPlugin({
      'done': () => {
        
        // copy main.css        
        const cssFile = path.join(__dirname, config.compilepath, config.memory, 'main.css')
        const destCssFile = path.join(config.destpath, config.memory, 'main.css')
        if(fs.existsSync(cssFile)) fs.copyFileSync(cssFile, destCssFile)        

        if(config.update) {
        
          // copy assets & fonts  
          const assetsDir = path.join(__dirname, config.compilepath, config.memory, 'assets') 
          const destAssetsDir = path.join(config.destpath, config.memory, 'assets')
          copydir.sync(assetsDir, destAssetsDir); 
          const fontsDir = path.join(__dirname, config.compilepath, config.memory, 'fonts') 
          const destFontsDir = path.join(config.destpath, config.memory, 'fonts')
          copydir.sync(fontsDir, destFontsDir);
        }
      }
    }),
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