const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  output: {
    path: __dirname + "/dist_firefox",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "manifest.json",
          to: "manifest.json",
          transform(content) {
            return modify(content).toString().replace("src/popup.html", "popup.html");
          },
        },
      ],
    }),
  ],
});

function modify(buffer) {
  const manifest = JSON.parse(buffer.toString());
  manifest.browser_specific_settings = { gecko: { id: "key-retriever@room-elephant.com" } };
  return JSON.stringify(manifest, null, 2);
}
