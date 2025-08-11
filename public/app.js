Pi.init({ version: "2.0" });

let currentUser = null;

// 상태 메시지 표시
function setStatus(msg) {
    document.getElementById("status").innerText = msg;
}

// 로그인 버튼 클릭
document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
        setStatus("로그인 시도 중...");
        const scopes = ['username', 'payments'];
        const auth = await Pi.authenticate(scopes, (payment) => {
            console.log("결제 콜백:", payment);
        });
        currentUser = auth.user;
        setStatus(`로그인 성공! 환영합니다, ${auth.user.username}님`);
        document.getElementById("paymentBtn").disabled = false;
    } catch (err) {
        console.error(err);
        setStatus("로그인 실패: " + err);
    }
});

// 결제 버튼 클릭
document.getElementById("paymentBtn").addEventListener("click", async () => {
    if (!currentUser) {
        setStatus("먼저 로그인해주세요!");
        return;
    }

    try {
        setStatus("결제 진행 중...");
        const paymentData = {
            amount: 0.001,
            memo: "Me2Verse 테스트 결제",
            metadata: { type: "test" }
        };

        const payment = await Pi.createPayment(paymentData, {
            onReadyForServerApproval: (paymentId) => {
                console.log("승인 요청:", paymentId);
                fetch("/approve", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ paymentId })
                });
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                console.log("완료 요청:", paymentId, txid);
                fetch("/complete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ paymentId, txid })
                });
            },
            onCancel: (paymentId) => {
                setStatus("결제 취소됨: " + paymentId);
            },
            onError: (error, payment) => {
