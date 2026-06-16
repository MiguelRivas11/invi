module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY;

  if (!publicKey) {
    res.status(500).json({ error: 'Missing VAPID_PUBLIC_KEY' });
    return;
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ publicKey });
};