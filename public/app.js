document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ me2verse-1 페이지 로드 완료");

  let retries = 0;
  const maxRetries = 20;

  function waitForPiSDK() {
    return new Promise((resolve, reject) => {
      const check = () => {
        if (window.Pi && typeof window.Pi.init === "function") {
          resolve();
        } else {
          retries++;
          if (retries < maxRetries) {
            console.log(`⏳ Pi SDK 로드 대기 중... (${retries}/${maxRetries})`);
            setTimeout(check, 500);
          } else {
            reject(new Error("Pi SDK 로드 실패"));
          }
        }
      };
      check();
    });
  }

  try {
    await waitForPiSDK();
    window.Pi.init({ version: "2.0", sandbox: true });
    console.log("✅ Pi SDK 초기화 완료");
  } catch (err) {
    console.error("❌ Pi SDK 초기화 오류:", err);
    alert("Pi 초기화 실패: " + err.message);
    return;
  }

  document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
      const scopes = ["username", "payments"];
      const loginData = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      console.log("✅ 로그인 성공:", loginData);
      document.getElementById("status").innerText = `로그인 완료: ${loginData.user.username}`;
    } catch (error) {
      console.error("❌ 로그인 오류:", error);
      alert("로그인 실패: " + error.message);
    }
  });

  document.getElementById("payBtn").addEventListener("click", async () => {
    try {
      const payment = await window.Pi.createPayment({
        amount: 1,
        memo: "me2verse-1 결제 테스트",
        metadata: { type: "test" }
      }, {
        onReadyForServerApproval: paymentId => console.log("📡 승인 요청:", paymentId),
        onReadyForServerCompletion: paymentId => console.log("📡 결제 완료:", paymentId),
        onCancel: paymentId => console.warn("🚫 결제 취소:", paymentId),
        onError: (error, payment) => console.error("❌ 결제 오류:", error, payment)
      });

      console.log("✅ 결제 요청 완료:", payment);
    } catch (error) {
      console.error("❌ 결제 오류:", error);
      alert("결제 실패: " + error.message);
    }
  });

  function onIncompletePaymentFound(payment) {
    console.warn("⚠ 미완료 결제 발견:", payment);
  }
});
