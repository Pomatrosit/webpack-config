const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

function bundleName(ext){
  let bundleStr='';
  if (isDev) bundleStr = `bundle.${ext}`;
  else bundleStr = `bundle.[hash].${ext}`;
  return bundleStr;
}

module.exports = {
  context: path.resolve(__dirname,"src"),
  mode:"development",
  entry:["@babel/polyfill", "./index.js"],
  output:{
    filename:bundleName("js"),
    path: path.resolve(__dirname, "build")
  },
  devServer:{
    port:3000,
    hot: isDev
  },
  devtool: isDev ? "source-map" : false,
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template:"index.html",
      minify:{
        removeComments:isProd,
        collapseWhitespace:isProd
      }
    }),
    new MiniCssExtractPlugin({
      filename: bundleName("css")
    })
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options:{
              hmr:isDev,
              reloadAll:true
            }
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: {
          loader: "babel-loader",
          options:{
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
