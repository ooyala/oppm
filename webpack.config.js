const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (entryPath, output, options) => {
  return {
    entry: options.entry,
    output: {
      path: output.path,
      filename: output.fileName,
      target: 'web'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new CopyWebpackPlugin([
        {
          from: entryPath
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
          loader: "script-loader"
        },
        {
          test: /\.css$/,
          loader: "style-loader!css-loader"
        },
        {
          test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg|json)(\?.*$|$)/,
          loader: `url-loader?context=${entryPath}&name=[path][name].[ext]&emitFile=true&limit=32000`
        }
      ]
    }
  };
};
