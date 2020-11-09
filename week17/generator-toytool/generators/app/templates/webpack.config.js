const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
  },
  /* resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['.js', '.vue', '.json'],
  }, */
  /* 不含模板编译，省略 vue 别名设置 */
  /* resolve: {
    extensions: ['.js', '.vue', '.json'],
  }, */
  devServer: {
    port: 9000,
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' }), new VueLoaderPlugin()],
};
