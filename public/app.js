const backendUrl = "https://me2verse-1.onrender.com";

// 로그인
async function piLogin() {
    try {
        const scopes = ['username', 'payments'];
        Pi.authenticate(scopes, onIncompletePaymentFound)
            .then(function(auth) {
                document.getElementById("status").innerText = `로그인 성공: ${auth.user.username}`;
                sessionStorage.setItem("pi_user", JSON.stringify(auth.user));
            }).catch(function(error) {
                console.error(error);
                document.getElementById("status").innerText = "로그인 실패";
            });
    } catch (err) {
        console.error("로그인 중 오류", err);
    }
}

// 결제
async function startPayment() {
    const user = JSON.parse(sessionStorage.getItem("pi_user"));
    if (!user) {
        alert("먼저 로그인해주세요.");
        return;
    }

    const paymentData = {
        amount: 1,
        memo: "Me2Verse 결제 테스트",
        metadata: { purpose: "test" }
    };

    Pi.createPayment(paymentData, {
        onReadyForServerApproval: async function(paymentId) {
            console.log("서버 승인 요청:", paymentId);
            await fetch(`${backendUrl}/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId })
            });
        },
        onReadyForServerCompletion: async function(paymentId, txid) {
            console.log("서버 결제 완료 요청:", paymentId, txid);
            await fetch(`${backendUrl}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid })
            });
        },
        onCancel: function(paymentId) {
            console.warn("결제 취소:", paymentId);
        },
        onError: function(error, payment) {
            console.error("결제 오류:", error, payment);
        }
    });
}

// 미결제 처리
function onIncompletePaymentFound(payment) {
    console.log("미결제 발견:", payment);
}
