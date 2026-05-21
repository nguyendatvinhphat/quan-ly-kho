const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    next();
});

const DATA_DIR = '/tmp';
const PORT = process.env.PORT || 3000;

app.get('/api/data/:room', (req, res) => {
  const file = path.join(DATA_DIR, 'data.json');
  let store = {};
  try { store = JSON.parse(fs.readFileSync(file, 'utf-8')); } catch (e) {}
  res.json(store[req.params.room] || { products: [], history: [] });
});

app.post('/api/data/:room', (req, res) => {
  const file = path.join(DATA_DIR, 'data.json');
  let store = {};
  try { store = JSON.parse(fs.readFileSync(file, 'utf-8')); } catch (e) {}
  store[req.params.room] = req.body;
  fs.writeFileSync(file, JSON.stringify(store));
  res.json({ ok: true });
});

app.get('/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log('Server on port ' + PORT));
