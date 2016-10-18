const webpack = require('webpack');
const path = require('path');

module.exports = (entry, output) => {
  return {
    entry: [
      `./${entry.path}/${entry.fileName}`
    ],
    output: {
      path: output.path,
      filename: output.fileName,
      target: 'web'
    },
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(true)
      })
    ],
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
        }/*,
        {
          test: /\.json$/,
          loader: "json-loader"
        }*/
      ]
    }
  };
};
