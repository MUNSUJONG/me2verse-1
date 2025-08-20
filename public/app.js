// 모듈 import
import { renderHobby } from "../modules/me2hobby.js";
// 나중에 필요 시 추가
// import { renderCulture } from "../modules/me2culture.js";

const root = document.getElementById("root");

// 초기 화면: 미투하비
renderHobby(root);

// (옵션) 나중에 버튼 클릭으로 모듈 전환 가능
/*
document.getElementById("btnHobby").addEventListener("click", () => {
    renderHobby(root);
});

document.getElementById("btnCulture").addEventListener("click", () => {
    renderCulture(root);
});
*/
