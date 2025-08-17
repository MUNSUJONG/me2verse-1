// Pi SDK 초기화
Pi.init({ version: "2.0" });

const statusDiv = document.getElementById("status");

// 로그인
document.getElementById("pi-login").addEventListener("click", async () => {
  try {
    const scopes = ['username', 'payments'];
    const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
    statusDiv.innerText = "로그인 성공: " + auth.user.username;
  } catch (err) {
    statusDiv.innerText = "로그인 실패: " + err;
  }
});

// 결제
document.getElementById("pi-pay").addEventListener("click", async () => {
  try {
    const payment = await Pi.createPayment({
      amount: 1,
      memo: "Me2Verse-1 결제 테스트",
      metadata: { custom: "데이터" }
    }, {
      onReadyForServerApproval: paymentId => {
        statusDiv.innerText = "결제 요청됨: " + paymentId;
      },
      onReadyForServerCompletion: paymentId => {
        statusDiv.innerText = "결제 승인 대기중: " + paymentId;
      },
      onCancel: paymentId => {
        statusDiv.innerText = "결제 취소: " + paymentId;
      },
      onError: (err, paymentId) => {
        statusDiv.innerText = "결제 에러: " + err;
      }
    });

    console.log("결제 객체:", payment);
  } catch (err) {
    statusDiv.innerText = "결제 실패: " + err;
  }
});

// 미완료 결제 처리
function onIncompletePaymentFound(payment) {
  console.log("미완료 결제 발견:", payment);
}
