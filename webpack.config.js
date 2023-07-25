const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");

module.exports = {
  mode: "none",
  entry: "./src/popup.js",
  output: {
    path: __dirname + "/dist",
    filename: "popup.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./src/popup.html",
          to: "popup.html",
          transform(content) {
            return content.toString().replace("../images/", "/images/");
          },
        },
        {
          from: "manifest.json",
          to: "manifest.json",
          transform(content) {
            return content.toString().replace("src/popup.html", "popup.html");
          },
        },
        { from: "./src/popup.css", to: "popup.css" },
        { from: "./src/assets", to: "assets" },
        { from: "./images", to: "images" },
      ],
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ minify: TerserPlugin.uglifyJsMinify }),
      new CssMinimizerPlugin(),
      new HtmlMinimizerPlugin(),
    ],
  },
};
