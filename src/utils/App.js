// src/App.js
import React, { useState, useEffect } from "react";

function PiLoginButton({ onLogin }) {
  const handleLogin = async () => {
    if (!window.Pi) {
      alert("Pi SDK가 로드되지 않았습니다. Pi 브라우저에서 접속해주세요.");
      return;
    }
    try {
      await window.Pi.authenticate({
        app_name: "me2verse-1",
        scope: ["username"]
      });
      onLogin(true);
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("로그인에 실패했습니다.");
      onLogin(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        padding: "12px 24px",
        backgroundColor: "#2563eb",
        color: "#fff",
        borderRadius: "6px",
        border: "none",
        fontSize: "16px",
        cursor: "pointer"
      }}
    >
      로그인
    </button>
  );
}

function PiPaymentButton({ loggedIn }) {
  const handlePayment = async () => {
    if (!loggedIn) {
      alert("먼저 로그인을 해주세요.");
      return;
    }
    if (!window.Pi) {
      alert("Pi SDK가 로드되지 않았습니다. Pi 브라우저에서 접속해주세요.");
      return;
    }
    try {
      const result = await window.Pi.requestPay({
        app_name: "me2verse-1",
        title: "Me2Verse-1 결제 테스트",
        value: "0.1",
        currency: "Pi",
        custom_identifier: "order_1234"
      });
      alert("결제가 완료되었습니다: " + JSON.stringify(result));
    } catch (err) {
      console.error("결제 실패:", err);
      alert("결제에 실패했습니다.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        padding: "12px 24px",
        backgroundColor: "#059669",
        color: "#fff",
        borderRadius: "6px",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
        marginLeft: "16px"
      }}
    >
      결제하기
    </button>
  );
}

function StatusMessage({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        marginTop: "24px",
        padding: "12px",
        backgroundColor: "#f3f4f6",
        borderRadius: "8px",
        color: "#374151",
        fontSize: "14px"
      }}
    >
      {message}
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (!window.Pi) {
      setStatusMsg("⚠️ Pi SDK를 감지하지 못했습니다. Pi 브라우저에서 접속해주세요.");
      return;
    }
    setStatusMsg("Pi SDK가 정상 로드되었습니다. 로그인을 진행해주세요.");
  }, []);

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "60px auto",
        padding: "0 20px",
        textAlign: "center",
        fontFamily: "'Noto Sans KR', sans-serif"
      }}
    >
      <h1 style={{ marginBottom: "32px", color: "#1f2937" }}>Me2Verse-1 로그인 및 결제</h1>
      <div>
        <PiLoginButton
          onLogin={(success) => {
            setLoggedIn(success);
            setStatusMsg(success ? "로그인에 성공했습니다!" : "로그인에 실패했습니다.");
          }}
        />
        <PiPaymentButton loggedIn={loggedIn} />
      </div>
      <StatusMessage message={statusMsg} />
    </div>
  );
        }
