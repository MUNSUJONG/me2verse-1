export function renderHobby(root) {
  const hobbies = [
    { name: "자동차", description: "메타버스에서 자동차 드라이브", img: "./images/car.jpg" },
    { name: "레이싱", description: "친구들과 레이싱 즐기기", img: "./images/racing.jpg" },
    { name: "낚시", description: "가상 호수에서 낚시 체험", img: "./images/fishing.jpg" },
    { name: "캠핑", description: "메타버스 캠핑 체험", img: "./images/camping.jpg" }
  ];

  root.innerHTML = ""; // 기존 내용 초기화
  hobbies.forEach(hobby => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = hobby.img;
    img.alt = hobby.name;

    const title = document.createElement("h2");
    title.textContent = hobby.name;

    const desc = document.createElement("p");
    desc.textContent = hobby.description;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    root.appendChild(card);
  });
}
