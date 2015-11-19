'use strict';

// Template from
// https://github.com/webpack/webpack-with-common-libs/blob/master/webpack.config.js

var PROD = JSON.parse(process.env.PROD || "0");

var webpack = require("webpack");
var path = require('path');

let ExtractTextPlugin = require('extract-text-webpack-plugin');

var settings = {
  entry: {
    'es6-editor': "./src/js/es6-editor.js"
  },
  output: {
    path: __dirname + "/lib",
    filename: PROD ? "[name].min.js" : "[name].js",
    chunkFilename: '[name].js',
    publicPath: "http://localhost:8080/lib/"
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|bower_components/,
        loader: 'jshint-loader'
      }
    ],
    loaders: [
      {
        test: /\.js$/, loader: "babel-loader",
        exclude: /node_modules|bower_components/
      },

      // required to write "require('./style.css')"
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass') },

      // required for bootstrap icons
      { test: /\.woff$/, loader: "url-loader?prefix=font/&limit=5000&mimetype=application/font-woff" },
      { test: /\.ttf$/, loader: "file-loader?prefix=font/" },
      { test: /\.eot$/, loader: "file-loader?prefix=font/" },
      { test: /\.svg$/, loader: "file-loader?prefix=font/" },

      // From specific requires, indicate what we want
      // to attach to the window scope.
      { test: /jquery\.js$/, loader: 'expose?$' },
      { test: /jquery\.js$/, loader: 'expose?jQuery' },
      { test: /codemirror\.js$/, loader: 'expose?CodeMirror' },
      { test: /modernizr\.js$/, loader: 'imports?this=>window' },

      // The latest nunjucks doesn't export stuff, so do it here.
      { test: /nunjucks\/browser\/nunjucks(-slim)\.js$/, loader: 'exports?nunjucks' },

      { test: /\.nunj$/,
        loader: 'nunjucks-loader',
        query: {
          config: __dirname + '/nunjucks.config.js',
        }
      }
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./bower_components")]
  },
  resolve: {
    // Prefer to keep this minimal as possible, as the more
    // paths webpack has to look through will slow down the
    // compile process.
    modulesDirectories: [
      "",
      "src/js",
      "node_modules",
      "bower_components"
    ],
    // This is somewhat trippy. Because webpack can't automatically
    // determine the main js files to import for underscore and backbone,
    // we need to help it out here and create aliases mapping that
    // relationship. That way, we can just do require('underscore') and
    // require('backbone') in our code. Or, in the ES6 way,
    // 'import "backbone"' and 'import "underscore"'
    alias: {
      jquery: 'jquery/dist/jquery',
      underscore: 'underscore/underscore',
      modernizr: 'modernizr/modernizr',
      nunjucks: 'nunjucks/browser/nunjucks-slim',
      templates: 'src/templates'
    }
  },
  plugins: PROD ? [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("es6-editor.min.css"),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({})
  ] : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("es6-editor.css")
  ],
  devtool: 'source-map'
};

// settings.plugins.push(
//   new webpack.optimize.CommonsChunkPlugin({
//       // this one only pulls common stuff from vendors and main
//     name: 'vendors',
//     chunks: ['main']
//   })
// );

module.exports = settings;
