export function renderLove(root) {
  const loves = [
    { name: "연애", description: "가상 연애 체험", img: "./images/love.jpg" },
    { name: "결혼", description: "메타버스 결혼 체험", img: "./images/wedding.jpg" }
  ];

  renderCards(root, loves, renderLove);
}

function renderCards(root, items, backFunc) {
  root.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;

    const title = document.createElement("h2");
    title.textContent = item.name;

    const desc = document.createElement("p");
    desc.textContent = item.description;

    card.addEventListener("click", () => renderDetail(root, item, backFunc));

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    root.appendChild(card);
  });
}

function renderDetail(root, item, backFunc) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "detail";

  const img = document.createElement("img");
  img.src = item.img;
  img.alt = item.name;

  const title = document.createElement("h2");
  title.textContent = item.name;

  const desc = document.createElement("p");
  desc.textContent = item.description + " (상세 설명 가능)";

  const backBtn = document.createElement("button");
  backBtn.className = "back-btn";
  backBtn.textContent = "← 돌아가기";
  backBtn.addEventListener("click", () => backFunc(root));

  container.appendChild(img);
  container.appendChild(title);
  container.appendChild(desc);
  container.appendChild(backBtn);
  root.appendChild(container);
}
