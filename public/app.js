// Me2verse-1 SPA 예시
const root = document.getElementById("root");

// 프로젝트 모듈 예시: 연애, 결혼, 취미, 우주체험
const modules = [
  { name: "연애", description: "유저가 연애 스토리를 경험할 수 있는 모듈" },
  { name: "결혼", description: "가상 결혼 체험 및 콘텐츠 제공" },
  { name: "취미", description: "다양한 취미 활동과 아이템 제공" },
  { name: "우주체험", description: "우주 여행과 체험 시뮬레이션" },
  { name: "미투러브", description: "스토리 제작, 유저 참여형 콘텐츠" }
];

// DOM 렌더링
modules.forEach(mod => {
  const card = document.createElement("div");
  card.style.border = "1px solid #ccc";
  card.style.padding = "1rem";
  card.style.margin = "1rem 0";
  card.style.borderRadius = "8px";
  card.style.backgroundColor = "#fff";

  const title = document.createElement("h2");
  title.textContent = mod.name;

  const desc = document.createElement("p");
  desc.textContent = mod.description;

  card.appendChild(title);
  card.appendChild(desc);
  root.appendChild(card);
});
