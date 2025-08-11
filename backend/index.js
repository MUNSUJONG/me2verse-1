import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const PI_API_KEY = process.env.PI_API_KEY;

app.get("/", (req, res) => {
    res.send("Me2Verse-1 Backend Running");
});

app.post("/approve", async (req, res) => {
    const { paymentId } = req.body;
    try {
        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
            method: "POST",
            headers: {
                Authorization: `Key ${PI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("승인 실패");
    }
});

app.post("/complete", async (req, res) => {
    const { paymentId, txid } = req.body;
    try {
        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
            method: "POST",
            headers: {
                Authorization: `Key ${PI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ txid })
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("결제 완료 실패");
    }
});

app.listen(PORT, () => {
    console.log(`✅ Me2Verse-1 Backend on port ${PORT}`);
});
