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
            return content.toString().replace("../images/", "/images/").replace("icon48.png", "key-retriever.png");
          },
        },
        { from: "./src/popup.css", to: "popup.css" },
        { from: "./src/assets", to: "assets" },
        { from: "./images/icon48.png", to: "images/key-retriever.png" },
        { from: "./images/empty-page.jpg", to: "images/empty-page.jpg" },
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
