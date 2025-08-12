import React, { useState, useEffect } from 'react';

const App = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('Pi Network에 연결을 준비 중입니다...');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPiAvailable, setIsPiAvailable] = useState(false);

  useEffect(() => {
    if (!window.Pi) {
      setStatus('Pi SDK가 로드되지 않았습니다. Pi Browser에서 실행 중인지 확인하세요.');
      return;
    }
    setIsPiAvailable(true);

    let environment = 'Production';
    if (window.location.hostname.includes('sandbox.minepi.com')) {
      environment = 'Sandbox';
    }

    setStatus(`환경: ${environment} - Pi SDK 초기화 중...`);

    try {
      window.Pi.init({
        onIncompletePaymentFound: (payment) => {
          setStatus(`미완료 결제 발견: ${payment.identifier}`);
        }
      }, {
        environment: environment
      });
      setIsInitialized(true);
      setStatus('Pi SDK가 성공적으로 초기화되었습니다. 로그인해주세요.');
    } catch (error) {
      setStatus(`Pi SDK 초기화 실패: ${error.message}`);
    }
  }, []);

  const handleLogin = async () => {
    if (!isPiAvailable || !isInitialized) {
      setStatus('Pi SDK가 준비되지 않았습니다. 잠시만 기다려주세요.');
      return;
    }

    setStatus('로그인 요청 중...');
    try {
      const authResult = await window.Pi.authenticate(['username', 'payments']);
      setUser(authResult.user);
      setStatus(`로그인 성공! 사용자 ID: ${authResult.user.uid}`);
    } catch (error) {
      setStatus(`로그인 실패: ${error.message}`);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      setStatus('먼저 로그인해주세요.');
      return;
    }
    
    setStatus('테스트 결제 요청 중...');
    try {
      const paymentData = {
        amount: 1,
        memo: 'me2vers-1 테스트 결제',
        metadata: { app: 'me2vers-1', type: 'test_payment' }
      };

      await window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId) => {
          setStatus(`서버 승인 대기중... 결제 ID: ${paymentId}`);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          setStatus(`결제 완료! 결제 ID: ${paymentId}, TXID: ${txid}`);
        },
        onCancel: (paymentId) => {
          setStatus(`사용자가 결제를 취소했습니다. 결제 ID: ${paymentId}`);
        },
        onError: (error) => {
          setStatus(`결제 실패: ${error.message}`);
        }
      });
    } catch (error) {
      setStatus(`테스트 결제 실패: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">me2vers-1 Pi Network 로그인 & 결제 테스트</h1>
        
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={!isInitialized || user}
            className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
          >
            {user ? '로그인 완료' : 'Pi 로그인'}
          </button>
          
          <button
            onClick={handlePayment}
            disabled={!user}
            className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
          >
            테스트 Pi 결제
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-200 rounded-lg text-left text-sm text-gray-700">
          <h2 className="font-bold mb-2">상태 로그:</h2>
          <p className="whitespace-pre-wrap">{status}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
