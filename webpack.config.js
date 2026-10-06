const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// PET Project Only configuration

module.exports = {
  // TODO: mode: 'production',
  // TODO: mode: 'development',
  mode: 'production',
  devtool: false,
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all', 
        },
      },
    },
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // svg
      // {
      //   test: /\.svg$/,
      //   use: ['@svgr/webpack'],
      // }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    // root path
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist'),
          globOptions: {
            ignore: ['**/index.html'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  devServer: {
    static: './dist',
    port: 8088,
    open: false,
    hot: true,
    watchFiles: ['public'],
    historyApiFallback: true // enabled routes
  }
};
