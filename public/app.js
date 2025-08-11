// Pi SDK 초기화
Pi.init({ version: "2.0" });

let currentUser = null;

// DOM 요소
const loginBtn = document.getElementById("loginBtn");
const payBtn = document.getElementById("payBtn");
const statusText = document.getElementById("status");

// 로그인 버튼 클릭
loginBtn.addEventListener("click", async () => {
  try {
    const scopes = ["username", "payments"];
    const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
    currentUser = auth.user;
    statusText.textContent = `로그인 상태: ✅ (${currentUser.username})`;
    payBtn.disabled = false;
    console.log("로그인 성공:", currentUser);
  } catch (err) {
    console.error("로그인 실패:", err);
    alert("로그인 실패. 다시 시도하세요.");
  }
});

// 결제 버튼 클릭
payBtn.addEventListener("click", async () => {
  if (!currentUser) {
    alert("먼저 로그인하세요!");
    return;
  }

  try {
    const payment = await Pi.createPayment({
      amount: 1,
      memo: "Me2Verse 테스트 결제",
      metadata: { type: "test" }
    }, {
      onReadyForServerApproval: (paymentId) => {
        console.log("서버 승인 필요:", paymentId);
        fetch("/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: (paymentId) => {
        console.log("서버 결제 완료 요청:", paymentId);
        fetch("/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },
      onCancel: (paymentId) => {
        console.warn("결제 취소:", paymentId);
      },
      onError: (error, payment) => {
        console.error("결제 오류:", error, payment);
        alert("결제 중 오류가 발생했습니다.");
      }
    });

    console.log("결제 생성:", payment);
  } catch (err) {
    console.error("결제 요청 실패:", err);
    alert("결제를 시작할 수 없습니다.");
  }
});

// 미완료 결제 처리
async function onIncompletePaymentFound(payment) {
  console.log("미완료 결제 발견:", payment);
}
