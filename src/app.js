import React, { useEffect, useState } from "react";

export default function App() {
  const [pi, setPi] = useState(null);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("SDK 로딩 중...");

  useEffect(() => {
    if (window.Pi) {
      setPi(window.Pi);
      setStatus("Pi SDK 로딩 완료. Pi Browser에서 접속하세요.");
    } else {
      setStatus("⚠️ Pi SDK를 찾을 수 없습니다.");
    }
  }, []);

  async function login() {
    if (!pi) return;
    setStatus("로그인 중...");
    try {
      const userData = await pi.authenticate({
        appName: "Me2Verse-1",
        sandbox: true,
      });
      setUser(userData);
      setStatus(`로그인 성공: ${userData.address}`);
    } catch (e) {
      setStatus(`로그인 실패: ${e.message}`);
    }
  }

  async function pay() {
    if (!pi || !user) {
      setStatus("먼저 로그인하세요.");
      return;
    }
    setStatus("결제 요청 중...");
    try {
      const tx = await pi.request({
        appName: "Me2Verse-1",
        action: "transfer",
        to: "받는사람_지갑주소", // 실제 지갑 주소로 바꿔야 합니다
        amount: 1,
        memo: "테스트 결제",
        sandbox: true,
      });
      setStatus(`결제 성공! TxId: ${tx.transactionId}`);
    } catch (e) {
      setStatus(`결제 실패: ${e.message}`);
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Me2Verse Pi 로그인 및 결제</h1>
      <button onClick={login} disabled={!!user}>
        Pi 로그인
      </button>
      <button onClick={pay} disabled={!user}>
        테스트 결제 (1π)
      </button>
      <pre>{status}</pre>
    </div>
  );
}
