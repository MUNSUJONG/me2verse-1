// Pi SDK 초기화
Pi.init({ version: "2.0" });

let currentUser = null;

// 상태 표시 함수
function setStatus(msg) {
    document.getElementById("status").innerText = "상태: " + msg;
}

// 로그인 버튼 클릭
document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
        setStatus("로그인 시도 중...");
        const scopes = ['username', 'payments'];
        const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound);
        currentUser = authResult.user;
        setStatus(`로그인 성공: ${currentUser.username}`);
        console.log("로그인 정보:", authResult);
    } catch (err) {
        console.error(err);
        setStatus("로그인 실패");
    }
});

// 결제 버튼 클릭
document.getElementById("payBtn").addEventListener("click", async () => {
    if (!currentUser) {
        setStatus("먼저 로그인해주세요");
        return;
    }

    try {
        setStatus("결제 요청 중...");
        const payment = await Pi.createPayment({
            amount: 1,
            memo: "테스트 결제",
            metadata: { type: "test" }
        }, {
            onReadyForServerApproval: (paymentId) => {
                console.log("서버 승인 필요:", paymentId);
                setStatus("서버 승인 단계...");
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                console.log("서버 완료 필요:", paymentId, txid);
                setStatus("결제 완료 단계...");
            },
            onCancel: (paymentId) => {
                console.log("결제 취소:", paymentId);
                setStatus("결제 취소됨");
            },
            onError: (error, paymentId) => {
                console.error("결제 오류:", error, paymentId);
                setStatus("결제 오류 발생");
            }
        });
    } catch (err) {
        console.error(err);
        setStatus("결제 실패");
    }
});

// 미완료 결제 처리
function onIncompletePaymentFound(payment) {
    console.log("미완료 결제 발견:", payment);
    setStatus("미완료 결제 있음");
}
