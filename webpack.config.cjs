import path from 'path';

module.exports = {
  // ... your other webpack configuration

  devServer: {
    https: {
      key: path.resolve(__dirname, 'localhost-key.pem'),
      cert: path.resolve(__dirname, 'localhost.pem'),
    },
    // ... other devServer options (e.g., port, proxy)
  },
};