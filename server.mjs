import express from 'express';
import fs from 'fs';
import https from 'https';
import next from 'next';

// Set environment for Next.js
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Initialize Express app
  const expressApp = express();

  // Load SSL certificate and private key
  const options = {
    key: fs.readFileSync('./localhost+2-key.pem'), // Path to your private key file
    cert: fs.readFileSync('./localhost+2.pem'),   // Path to your self-signed certificate file
  };

  // Set a timeout for all routes in Express app
  expressApp.use((req, res, next) => {
    res.setTimeout(20000, () => { // Timeout set to 20 seconds
      res.status(408).send('Request Timeout');
    });
    next();
  });

  // Use Next.js to handle all routes dynamically
  expressApp.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the HTTPS server
  https.createServer(options, expressApp).listen(3001, () => {
    console.log('HTTPS server running on https://localhost:3001');
  });
});
