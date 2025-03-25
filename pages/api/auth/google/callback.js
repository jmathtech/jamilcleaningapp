import { handleAuth, handleCallback } from 'auth0/nextjs-auth0';

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { redirectTo: '/dashboard' });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  }
});