const express = require('express');
const https   = require('https');
const router  = express.Router();

// Use NASA_API_KEY env var if set, otherwise fall back to DEMO_KEY
const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&thumbs=true`;

// In-memory cache — one entry, refreshed daily
let cache = { date: null, data: null };

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch (e) { reject(new Error('Invalid JSON from NASA API')); }
      });
    }).on('error', reject);
  });
}

router.get('/', async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    if (cache.date === today && cache.data) {
      return res.json(cache.data);
    }

    const { status, body } = await fetchJSON(NASA_URL);

    if (status !== 200 || body.error) {
      console.error(`APOD: NASA returned ${status}`, body.error || '');
      return res.status(status === 200 ? 502 : status).json({
        error: body.error || { message: `NASA API returned status ${status}` },
      });
    }

    cache = { date: today, data: body };
    res.json(body);
  } catch (err) {
    console.error('APOD proxy error:', err.message);
    res.status(502).json({ error: { message: 'Failed to reach NASA API' } });
  }
});

module.exports = router;
