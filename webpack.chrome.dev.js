const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/popup.ts",
  output: {
    path: path.resolve(__dirname, "dist_dev"),
    filename: "popup.js",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "manifest.json",
          to: "manifest.json",
          transform(content) {
            const manifest = JSON.parse(content.toString());
            manifest.version = "0.0.0";

            if (manifest.action && manifest.action.default_popup) {
              manifest.action.default_popup = manifest.action.default_popup.replace("src/popup.html", "popup.html");
            }
            return JSON.stringify(manifest, null, 2);
          },
        },
        { from: "./src/popup.html", to: "popup.html" },
        { from: "./src/popup.css", to: "popup.css" },
        { from: "./src/assets", to: "assets" },
        { from: "./images", to: "images" },
        { from: "./imagesDev", to: "images" },
      ],
    }),
    new MiniCssExtractPlugin(),
  ],
};
