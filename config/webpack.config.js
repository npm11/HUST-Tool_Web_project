const path = require("path");

module.exports = {
  mode: "development", // hoặc 'production' tùy thuộc vào môi trường của bạn
  entry: "./src/js/quiz.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
