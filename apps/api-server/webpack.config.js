const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: 'node',
  entry: './src/main.ts',
  output: {
    path: join(__dirname, '../../dist/apps/api-server'),
    filename: 'main.js',
    clean: true,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
};
