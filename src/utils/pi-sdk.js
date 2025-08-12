export async function initializePi() {
    return new Promise((resolve, reject) => {
        if (!window.Pi) {
            reject(new Error('Pi SDK가 로드되지 않았습니다. 파이 브라우저에서 실행 중인지 확인하세요.'));
            return;
        }

        window.Pi.init({
            onIncompletePaymentFound: (payment) => {
                console.warn('미완료 결제 발견:', payment);
            }
        });

        window.Pi.authenticate(['username', 'payments'])
            .then(authResult => {
                resolve(authResult.user);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export async function requestPiPayment() {
    return new Promise((resolve, reject) => {
        if (!window.Pi || !window.Pi.createPayment) {
            reject(new Error('파이 결제 기능이 준비되지 않았습니다.'));
            return;
        }

        const paymentData = {
            amount: 1,
            memo: 'Me2vers-1 테스트 결제',
            metadata: { app: 'Me2vers-1', type: 'test_payment' }
        };

        window.Pi.createPayment(paymentData, {
            onReadyForServerApproval: (paymentId) => {
                console.log('서버 승인 대기중...', paymentId);
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                console.log('결제 완료!', paymentId, txid);
                resolve({ identifier: paymentId, txid: txid });
            },
            onCancel: (paymentId) => {
                reject(new Error('사용자가 결제를 취소했습니다.'));
            },
            onError: (error) => {
                reject(error);
            }
        }).catch(error => {
            reject(error);
        });
    });
}
