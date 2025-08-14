document.addEventListener('DOMContentLoaded', async () => {
  if (!window.Pi) {
    alert("Pi SDK가 로드되지 않았습니다. Pi Browser에서 접속하세요.");
    return;
  }

  try {
    const initTimeout = 10000; // 최대 10초 대기
    const initPromise = window.Pi.init({ appId: "me2verse-1", sandbox: true });
    
    const timer = new Promise((_, reject) => setTimeout(() => reject("Pi SDK 초기화 시간 초과"), initTimeout));
    await Promise.race([initPromise, timer]);

    const user = await window.Pi.login();
    if (user) {
      document.getElementById('status').innerText = `로그인 성공: ${user.username}`;
    } else {
      document.getElementById('status').innerText = "로그인 실패";
    }
  } catch (err) {
    console.error("Pi SDK 초기화 오류:", err);
    document.getElementById('status').innerText = `Pi SDK 초기화 실패: ${err}`;
  }
});
