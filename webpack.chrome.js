const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  output: {
    path: __dirname + "/dist_chrome",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "manifest.json",
          to: "manifest.json",
          transform(content) {
            return content.toString().replace("src/popup.html", "popup.html");
          },
        },
      ],
    }),
  ],
});
