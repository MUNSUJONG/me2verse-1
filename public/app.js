document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const loginBtn = document.getElementById('loginBtn');
  const payBtn = document.getElementById('payBtn');

  // Pi SDK 로드 확인
  if (!window.Pi) {
    alert("Pi SDK가 로드되지 않았습니다. Pi Browser에서 접속하세요.");
    statusDiv.innerText = "Pi SDK 로드 실패";
    return;
  }

  let user = null;
  const BACKEND_URL = 'http://localhost:10000'; // 로컬 서버 URL

  // 서버 상태 확인
  const checkServer = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/ping`);
      const text = await res.text();
      console.log("서버 상태:", text);
      statusDiv.innerText = text;
    } catch (err) {
      console.error("서버 상태 확인 실패:", err);
      statusDiv.innerText = "서버 상태 확인 실패";
    }
  };

  checkServer(); // 초기 상태 확인

  // 로그인 버튼
  loginBtn.addEventListener('click', async () => {
    try {
      // Pi SDK 초기화 (샌드박스 모드)
      await window.Pi.init({ appId: "me2verse-1", sandbox: true });
      user = await window.Pi.login();
      if (user) {
        statusDiv.innerText = `로그인 성공: ${user.username}`;
        console.log("로그인 성공", user);
      } else {
        statusDiv.innerText = "로그인 실패";
      }
    } catch (err) {
      console.error("Pi SDK 로그인 오류:", err);
      statusDiv.innerText = `로그인 오류: ${err}`;
    }
  });

  // 결제 버튼
  payBtn.addEventListener('click', async () => {
    if (!user) {
      alert("먼저 로그인해주세요.");
      return;
    }

    try {
      const txid = `TEST-${Date.now()}`;
      const amount = 3.14;

      const res = await fetch(`${BACKEND_URL}/approve-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txid, amount })
      });

      const data = await res.json();
      alert(`결제 승인됨: ${JSON.stringify(data)}`);
    } catch (err) {
      console.error("결제 승인 오류:", err);
      alert(`결제 오류: ${err}`);
    }
  });
});
