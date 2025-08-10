document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const payBtn = document.getElementById("payBtn");
  const statusEl = document.getElementById("status");

  // Pi SDK 초기화 (Pi 브라우저에서만 작동)
  if (typeof Pi !== "undefined") {
    Pi.init({ version: "2.0" });
  } else {
    statusEl.textContent = "⚠ Pi 브라우저에서 접속해주세요.";
  }

  // 로그인 버튼 클릭
  loginBtn.addEventListener("click", async () => {
    if (typeof Pi === "undefined") {
      alert("Pi 브라우저에서만 로그인할 수 있습니다.");
      return;
    }

    try {
      const scopes = ["payments", "username"];
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      console.log("로그인 성공:", auth);
      statusEl.textContent = `✅ 로그인 성공: ${auth.user.username}`;
      payBtn.disabled = false;
    } catch (err) {
      console.error("로그인 실패:", err);
      statusEl.textContent = "❌ 로그인 실패";
    }
  });

  // 결제 버튼 클릭
  payBtn.addEventListener("click", () => {
    alert("결제 진행 로직 연결 필요");
  });

  function onIncompletePaymentFound(payment) {
    console.log("미완료 결제:", payment);
  }
});
