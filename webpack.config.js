const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (entry, output, options) => {
  return {
    entry: [
      path.join(entry.path, entry.fileName)
    ],
    output: {
      path: output.path,
      filename: output.fileName,
      target: 'web'
    },
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(true)
      }),
      new CopyWebpackPlugin([
        {
          from: entry.path
        }
      ], {
        ignore: [].concat.apply([], [options.excludeFromCopy, entry.fileName])
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
          loader: `url-loader?context=${entry.path}&name=[path][name].[ext]&emitFile=true&limit=32000`
        }
      ]
    }
  };
};
