const webpush = require('web-push');
const { kv } = require('@vercel/kv');

const STORAGE_KEY = 'van-gogh:push-subscriptions';

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (error) {
      return {};
    }
  }

  return body;
}

function getMemoryStore() {
  if (!globalThis.__vanGoghPushStore) {
    globalThis.__vanGoghPushStore = new Map();
  }

  return globalThis.__vanGoghPushStore;
}

async function getSubscriptions() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const entries = await kv.hgetall(STORAGE_KEY);
    return Object.values(entries || {}).map((entry) => JSON.parse(entry));
  }

  return Array.from(getMemoryStore().values());
}

async function removeSubscription(endpoint) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    await kv.hdel(STORAGE_KEY, endpoint);
    return;
  }

  getMemoryStore().delete(endpoint);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { date } = parseBody(req.body);

  if (!date) {
    res.status(400).json({ error: 'Missing date' });
    return;
  }

  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:hello@example.com';

  if (!vapidPublicKey || !vapidPrivateKey) {
    res.status(500).json({ error: 'Missing VAPID keys' });
    return;
  }

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const subscriptions = await getSubscriptions();
  const payload = JSON.stringify({
    title: 'Universo de Van Gogh',
    body: `Eligieron ${date}. Abre la invitación para verla.`,
    url: './'
  });

  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, payload);
        return { ok: true };
      } catch (error) {
        const statusCode = error && error.statusCode;

        if (statusCode === 404 || statusCode === 410) {
          await removeSubscription(subscription.endpoint);
        }

        throw error;
      }
    })
  );

  const sent = results.filter((result) => result.status === 'fulfilled').length;
  const failed = results.length - sent;

  res.status(200).json({ ok: true, sent, failed });
};