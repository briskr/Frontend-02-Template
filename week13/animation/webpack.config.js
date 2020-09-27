const path = require('path');

module.exports = {
  entry: {
    main: './main.js',
    anim: './animation-demo.js',
  },
  /* output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  }, */
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'createElement',
                },
              ],
            ],
          },
        },
      },
    ],
  },
  mode: 'development',
};
