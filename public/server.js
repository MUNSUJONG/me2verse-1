import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// 👉 Pi API 기본 URL
const PI_API_URL = "https://api.minepi.com/v2/payments";

// 👉 환경변수로 관리하세요 (절대 코드에 직접 쓰지 마세요)
const PI_API_KEY = process.env.PI_API_KEY;

// ✅ 1. 결제 승인 (onReadyForServerApproval 시 호출)
app.post("/payments/approve", async (req, res) => {
  const { paymentId } = req.body;

  try {
    const response = await axios.post(
      `${PI_API_URL}/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("승인 성공:", response.data);
    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error("승인 실패:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ 2. 결제 완료 (onReadyForServerCompletion 시 호출)
app.post("/payments/complete", async (req, res) => {
  const { paymentId, txid } = req.body;

  try {
    const response = await axios.post(
      `${PI_API_URL}/${paymentId}/complete`,
      { txid },
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("완료 성공:", response.data);
    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error("완료 실패:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ 3. (선택) 미완료 결제 확인
app.get("/payments/:paymentId", async (req, res) => {
  const { paymentId } = req.params;

  try {
    const response = await axios.get(`${PI_API_URL}/${paymentId}`, {
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
