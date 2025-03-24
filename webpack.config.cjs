import path from 'path';

module.exports = {
  mode: 'development', // Or 'production' or 'none'
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
  },

  devServer: {
    https: {
      key: path.resolve(__dirname, 'localhost-key.pem'),
      cert: path.resolve(__dirname, 'localhost.pem'),
    },
    // ... other devServer options (e.g., port, proxy)
    port: 3000,
    open: true,
    hot: true,
    liveReload: true,
    // ... other devServer options
    static: {
      directory: path.join(__dirname, 'public'), // Serve from public directory
    },
  },
};