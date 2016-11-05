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
      new CopyWebpackPlugin([
        {
          from: context
        }
      ], {
        ignore: options.copyIgnore
      })
    ],
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    module: {
      loaders: [
        {
          test: /^.+\.min\.js$/,
          loader: 'script-loader'
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        },
        {
          test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg|json)(\?.*$|$)/,
          loader: 'file-loader?name=[path][name].[ext]&emitFile=false'
          //loader: 'url-loader?name=[path][name].[ext]&emitFile=false&limit=3200'
        }
      ]
    }
  };
};
