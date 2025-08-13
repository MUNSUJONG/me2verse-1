import React, { useState, useEffect } from 'react';

// Pi SDK는 index.html에서 로드되므로, 별도로 import하지 않습니다.
// 대신, window.Pi 객체를 통해 접근합니다.

// Me2Verse-1의 핵심 기능을 담당하는 메인 컴포넌트입니다.
export default function App() {
  // Pi SDK의 준비 상태를 관리하는 상태 변수
  const [isPiReady, setIsPiReady] = useState(false);
  // 사용자 로그인 상태를 관리하는 상태 변수
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 현재 로그인한 사용자의 정보를 저장하는 상태 변수
  const [piUser, setPiUser] = useState(null);
  // 사용자에게 표시할 메시지(로그)를 관리하는 상태 변수
  const [statusMessage, setStatusMessage] = useState('앱이 로드되었습니다. Pi 네트워크 연결을 시도 중...');

  // Pi SDK 초기화를 위한 useEffect 훅입니다.
  useEffect(() => {
    let piInitInterval = null;

    // Pi SDK가 window 객체에 로드되었는지 주기적으로 확인하는 함수
    const checkPiSdkAndInit = () => {
      if (window.Pi && typeof window.Pi.init === 'function') {
        clearInterval(piInitInterval);
        try {
          // 샌드박스 테스트를 위해 sandbox: true 옵션을 추가
          window.Pi.init({ 
            version: "2.0", 
            appName: "me2verse-1",
            sandbox: true, // 샌드박스 환경에서 테스트를 위해 반드시 필요합니다.
            onReady: () => {
              setIsPiReady(true);
              setStatusMessage('✅ Pi SDK가 성공적으로 초기화되었습니다.');
            }
          });
        } catch (error) {
          setStatusMessage(`❌ Pi SDK 초기화 중 오류가 발생했습니다: ${error.message}`);
          console.error("Pi SDK initialization error:", error);
        }
      } else {
        // Pi SDK가 아직 로드되지 않았을 경우 상태 메시지 업데이트
        setStatusMessage('⏳ Pi SDK 로드 대기 중... 이 앱은 Pi 브라우저에서만 정상 작동합니다.');
      }
    };

    // 500ms 간격으로 Pi SDK 로드 여부를 확인
    piInitInterval = setInterval(checkPiSdkAndInit, 500);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(piInitInterval);
  }, []);

  // 미완료 결제(Incomplete Payment)를 처리하는 함수
  const onIncompletePaymentFound = (payment) => {
    console.warn("⚠ 미완료 결제 발견:", payment);
    setStatusMessage(`⚠️ 미완료 결제(ID: ${payment.identifier})가 있습니다.`);
    // TODO: 여기에서 미완료 결제에 대한 UI 처리 또는 로직을 추가할 수 있습니다.
  };

  // 로그인 버튼 클릭 이벤트 핸들러
  const handleLogin = async () => {
    setStatusMessage('로그인 요청 중...');
    try {
      const scopes = ["username", "payments"];
      const authData = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      
      setIsLoggedIn(true);
      setPiUser(authData.user);
      setStatusMessage(`✅ 로그인 성공: ${authData.user.username}`);
    } catch (error) {
      setStatusMessage(`❌ 로그인 실패: ${error.message}`);
      console.error("Login error:", error);
    }
  };

  // 결제 버튼 클릭 이벤트 핸들러
  const handlePayment = async () => {
    setStatusMessage('테스트 결제 요청 중...');
    try {
      // 결제 생성
      const paymentData = {
        amount: 1,
        memo: "me2verse-1 결제 테스트",
        metadata: { type: "test" }
      };

      // 최신 API인 Pi.payments.createPayment를 사용합니다.
      await window.Pi.payments.createPayment(paymentData, {
        onReadyForServerApproval: paymentId => {
          console.log("📡 승인 요청:", paymentId);
          setStatusMessage(`✅ 결제 생성 완료, 서버 승인 대기 중... (ID: ${paymentId})`);
        },
        onReadyForServerCompletion: paymentId => {
          console.log("📡 결제 완료:", paymentId);
          setStatusMessage(`✅ 결제 완료! (ID: ${paymentId})`);
        },
        onCancel: paymentId => {
          console.warn("🚫 결제 취소:", paymentId);
          setStatusMessage(`❌ 결제 취소되었습니다. (ID: ${paymentId})`);
        },
        onError: (error, payment) => {
          console.error("❌ 결제 오류:", error, payment);
          setStatusMessage(`❌ 결제 오류: ${error.message}`);
        }
      });
    } catch (error) {
      setStatusMessage(`❌ 결제 실패: ${error.message}`);
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-2 text-center text-teal-400">Me2Verse-1</h1>
        <p className="text-sm text-gray-400 text-center mb-8">
          Pi 네트워크 기반 메타버스 플랫폼
        </p>

        {isLoggedIn && (
          <div className="bg-gray-700 p-4 rounded-lg mb-6 text-center shadow-inner">
            <h2 className="text-xl font-semibold text-emerald-400">환영합니다, {piUser.username}님!</h2>
            <p className="text-gray-300 mt-2">ID: {piUser.uid}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoggedIn || !isPiReady}
          className={`w-full font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 mb-4 ${
            isLoggedIn ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
          }`}
        >
          {isLoggedIn ? '이미 로그인되었습니다' : '파이 계정으로 로그인'}
        </button>

        <button
          onClick={handlePayment}
          disabled={!isLoggedIn || !isPiReady}
          className={`w-full font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 mb-6 ${
            !isLoggedIn ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        >
          테스트 결제 (1 Pi)
        </button>

        <div className="bg-gray-700 p-4 rounded-lg mt-6 overflow-auto text-sm max-h-40">
          <h2 className="text-xl font-semibold mb-2">상태 로그</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{statusMessage}</p>
        </div>
      </div>
    </div>
  );
}
