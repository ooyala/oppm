const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (context, output, options) => {
  return {
    context: context,
    entry: options.entry,
    output: {
      path: output.path,
      filename: `[hash].${output.fileName}`,
      target: 'web'
    },
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new CopyWebpackPlugin(options.copy.patterns, options.copy.options)
    ],
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    module: {
      loaders: [
        {
          test: /\.(min\.js|js)$/,
          exclude: /css-base\.js$/,
          loader: 'script-loader'
        },
        {
          test: /\.css$/,
          loader: 'style-loader?insertAt=top!css-loader'
        },
        {
          test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
          loader: 'file-loader?name=[path][name].[ext]&emitFile=false'
          //loader: 'url-loader?name=[path][name].[ext]&emitFile=false&limit=3200'
        }
      ]
    }
  };
};
