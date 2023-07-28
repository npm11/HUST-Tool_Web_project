const path = require('path');

module.exports = {
  entry: './quiz.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
