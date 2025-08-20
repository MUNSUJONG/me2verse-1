// modules 폴더에서 미투하비 모듈 import
import { renderHobby } from "../modules/me2hobby.js";

// root 요소 선택
const root = document.getElementById("root");

// 초기 화면: 미투하비 카드 목록
renderHobby(root);

// 참고: 이후 모듈 추가 시
// import { renderCulture } from "../modules/me2culture.js";
// 버튼 클릭 등으로 다른 모듈 렌더링 가능
/*
document.getElementById("btnCulture").addEventListener("click", () => {
    renderCulture(root);
});
*/
