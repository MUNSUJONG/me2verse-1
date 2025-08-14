document.addEventListener('DOMContentLoaded', async () => {
  if (!window.Pi) {
    console.error("Pi SDK가 로드되지 않았습니다!");
    alert("Pi SDK가 로드되지 않았습니다. 브라우저에서 Pi 앱으로 접속해주세요.");
    return;
  }

  // Pi SDK 초기화
  await window.Pi.init({ appId: "me2verse-1" });

  // 로그인
  const user = await window.Pi.login();
  if (user) {
    console.log("로그인 성공:", user);
    document.getElementById('status').innerText = `로그인 성공: ${user.username}`;
  } else {
    console.log("로그인 실패");
    document.getElementById('status').innerText = "로그인 실패";
  }
});
