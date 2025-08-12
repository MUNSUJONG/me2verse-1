useEffect(() => {
  addLog('Pi SDK 초기화를 준비 중입니다...');

  if (typeof window.Pi === 'undefined') {
    addLog('Pi SDK가 로드되지 않았습니다. Pi Browser에서 실행 중인지 확인하세요.', true);
    return;
  }
  setIsPiAvailable(true);

  let environment = 'Production';
  if (
    window.location.hostname === 'sandbox.minepi.com' || 
    window.location.hostname.includes('sandbox')
  ) {
    environment = 'Sandbox';
  }
  addLog(`현재 감지된 환경: ${environment}`);

  try {
    window.Pi.init({
      onIncompletePaymentFound: (payment) => {
        addLog(`미완료 결제 발견: ${payment.identifier}`);
      }
    }, {
      environment: environment
    });
    setIsInitialized(true);
    addLog('Pi SDK가 성공적으로 초기화되었습니다. 이제 로그인할 수 있습니다.');
  } catch (error) {
    addLog(`Pi SDK 초기화 실패: ${error.message}`, true);
  }
}, []);
