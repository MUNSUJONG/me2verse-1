import React, { useState, useEffect } from 'react';

const App = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('Pi Network 준비 중...');
  const [isInitialized, setIsInitialized] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (!window.Pi) {
      setStatus('❌ Pi SDK가 로드되지 않았습니다. Pi Browser에서 접속하세요.');
      return;
    }

    setStatus('🔄 Pi SDK 초기화 중...');
    try {
      window.Pi.init(
        {
          onIncompletePaymentFound: (payment) => {
            setStatus(`⚠️ 미완료 결제 발견: ${payment.identifier}`);
          }
        },
        {
          environment: process.env.REACT_APP_PI_ENV || 'sandbox', // 'production'으로 변경 가능
        }
      );

      setIsInitialized(true);
      setStatus('✅ Pi SDK 초기화 완료! 로그인 가능합니다.');
    } catch (error) {
      setStatus(`❌ Pi SDK 초기화 실패: ${error.message}`);
    }
  }, []);

  const handleLogin = async () => {
    if (!isInitialized) {
      setStatus('❌ SDK 초기화 전입니다.');
      return;
    }

    setStatus('🔑 로그인 요청 중...');
    try {
      const authResult = await window.Pi.authenticate(['username', 'payments']);
      setUser(authResult.user);
      setAccessToken(authResult.accessToken);
      setStatus(`✅ 로그인 성공! 사용자: ${authResult.user.username}`);
    } catch (error) {
      setStatus(`❌ 로그인 실패: ${error.message}`);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      setStatus('⚠️ 먼저 로그인하세요.');
      return;
    }

    setStatus('💰 결제 요청 중...');
    try {
      await window.Pi.createPayment(
        {
          amount: 1,
          memo: 'Me2verse-1 테스트 결제',
          metadata: { app: 'Me2verse-1', type: 'test_payment' },
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            setStatus(`📡 서버 승인 요청: ${paymentId}`);
            // Render 백엔드에 승인 요청 보내기
            try {
              await fetch(`${process.env.REACT_APP_BACKEND_URL}/approve-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ paymentId }),
              });
            } catch (err) {
              setStatus(`❌ 서버 승인 실패: ${err.message}`);
            }
          },
          onReadyForServerCompletion: async (paymentId, txid) => {
            setStatus(`✅ 결제 완료! ID: ${paymentId}, TXID: ${txid}`);
            try {
              await fetch(`${process.env.REACT_APP_BACKEND_URL}/complete-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ paymentId, txid }),
              });
            } catch (err) {
              setStatus(`❌ 결제 완료 전송 실패: ${err.message}`);
            }
          },
          onCancel: (paymentId) => {
            setStatus(`🚫 결제 취소됨: ${paymentId}`);
          },
          onError: (error, payment) => {
            setStatus(`❌ 결제 실패: ${error.message}`);
          },
        }
      );
    } catch (error) {
      setStatus(`❌ 결제 요청 실패: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Me2verse-1 Pi 결제 테스트</h1>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={!isInitialized || !!user}
            className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg disabled:bg-gray-400"
          >
            {user ? '✅ 로그인 완료' : '🔑 Pi 로그인'}
          </button>

          <button
            onClick={handlePayment}
            disabled={!user}
            className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg disabled:bg-gray-400"
          >
            💰 테스트 결제
          </button>
        </div>

        <div className="mt-6 p-3 bg-gray-200 rounded text-left text-sm">
          <p className="whitespace-pre-wrap">{status}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
