// me2verse-1 backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('✅ Me2Verse-1 Backend is running 🚀');
});

app.get('/ping', (req, res) => {
  res.send('🟢 Me2Verse-1 ping OK');
});

/**
 * (Optional) Server-side payment creation
 * Some apps create a payment server-side. Not required if you use Pi.createPayment on the client.
 */
app.post('/payments/create', async (req, res) => {
  try {
    const { amount, memo, metadata } = req.body;
    const apiUrl = 'https://api.minepi.com/v2/payments';
    const response = await axios.post(apiUrl, { amount, memo, metadata }, {
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return res.json(response.data);
  } catch (err) {
    console.error('Me2Verse-1: /payments/create error', err?.response?.data || err.message);
    return res.status(500).json({ error: 'create payment failed', detail: err?.response?.data || err.message });
  }
});

/**
 * Server-side approval:
 * Called when the client receives onReadyForServerApproval(paymentId)
 */
app.post('/payments/approve', async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: 'paymentId required' });

    const apiUrl = `https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/approve`;
    const response = await axios.post(apiUrl, {}, {
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Me2Verse-1: approved', paymentId, response.data);
    return res.json(response.data);
  } catch (err) {
    console.error('Me2Verse-1: /payments/approve error', err?.response?.data || err.message);
    return res.status(500).json({ error: 'approve payment failed', detail: err?.response?.data || err.message });
  }
});

/**
 * Server-side completion:
 * Called when the client receives onReadyForServerCompletion(paymentId, txid)
 */
app.post('/payments/complete', async (req, res) => {
  try {
    const { paymentId, txid } = req.body;
    if (!paymentId) return res.status(400).json({ error: 'paymentId required' });

    const apiUrl = `https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/complete`;
    const body = txid ? { txid } : {};
    const response = await axios.post(apiUrl, body, {
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Me2Verse-1: completed', paymentId, response.data);
    return res.json(response.data);
  } catch (err) {
    console.error('Me2Verse-1: /payments/complete error', err?.response?.data || err.message);
    return res.status(500).json({ error: 'complete payment failed', detail: err?.response?.data || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Me2Verse-1 Server running on port ${PORT}`);
});
