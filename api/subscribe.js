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

async function readSubscriptions() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const entries = await kv.hgetall(STORAGE_KEY);
    return Object.values(entries || {}).map((entry) => JSON.parse(entry));
  }

  return Array.from(getMemoryStore().values());
}

async function saveSubscription(subscription) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    await kv.hset(STORAGE_KEY, { [subscription.endpoint]: JSON.stringify(subscription) });
    return;
  }

  getMemoryStore().set(subscription.endpoint, subscription);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { subscription } = parseBody(req.body);

    if (!subscription || !subscription.endpoint) {
      res.status(400).json({ error: 'Invalid subscription' });
      return;
    }

    await saveSubscription(subscription);

    const count = (await readSubscriptions()).length;
    res.status(200).json({ ok: true, count });
  } catch (error) {
    res.status(500).json({ error: 'Could not save subscription' });
  }
};