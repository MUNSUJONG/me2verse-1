// backend/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// 기본: 샌드박스 API. 프로덕션 전환 시 .env의 API_URL 변경 권장.
const API_BASE = process.env.API_URL || 'https://sandbox.minepi.com/v2';

app.use(cors());
app.use(express.json());

// Health
app.get('/', (req, res) => res.send('✅ Me2Verse-1 Backend OK'));

/**
 * Create payment (server-side creation, optional)
 * Body: { amount: number, memo?: string, metadata?: object }
 */
app.post('/payment/create', async (req, res) => {
  try {
    const { amount, memo = '', metadata = {} } = req.body;
    const resp = await axios.post(
      `${API_BASE}/payments`,
      { amount, memo, metadata },
      { headers: { Authorization: `Key ${process.env.PI_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    return res.json(resp.data);
  } catch (err) {
    console.error('create error', err.response?.data || err.message);
    return res.status(500).json({ error: 'create_failed', detail: err.response?.data || err.message });
  }
});

/**
 * Approve payment
 * Body: { paymentId: string }
 * Called when Pi.createPayment -> onReadyForServerApproval(paymentId)
 */
app.post('/payment/approve', async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: 'paymentId_required' });

    const resp = await axios.post(
      `${API_BASE}/payments/${encodeURIComponent(paymentId)}/approve`,
      {},
      { headers: { Authorization: `Key ${process.env.PI_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    return res.json(resp.data);
  } catch (err) {
    console.error('approve error', err.response?.data || err.message);
    return res.status(500).json({ error: 'approve_failed', detail: err.response?.data || err.message });
  }
});

/**
 * Complete payment
 * Body: { paymentId: string, txid?: string }
 * Called when Pi.createPayment -> onReadyForServerCompletion(paymentId, txid)
 */
app.post('/payment/complete', async (req, res) => {
  try {
    const { paymentId, txid } = req.body;
    if (!paymentId) return res.status(400).json({ error: 'paymentId_required' });

    const body = txid ? { txid } : {};
    const resp = await axios.post(
      `${API_BASE}/payments/${encodeURIComponent(paymentId)}/complete`,
      body,
      { headers: { Authorization: `Key ${process.env.PI_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    return res.json(resp.data);
  } catch (err) {
    console.error('complete error', err.response?.data || err.message);
    return res.status(500).json({ error: 'complete_failed', detail: err.response?.data || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Me2Verse-1 backend listening on ${PORT} (API_BASE=${API_BASE})`);
});
