// me2hobby.js
export function renderHobby(root) {
  const hobbies = [
    { name:"자동차", desc:"메타버스에서 자동차 드라이브", img:"./images/car.jpg", fee:"0.05 Pi", usage:"운전 체험 5분", nft:true },
    { name:"레이싱", desc:"친구들과 레이싱 즐기기", img:"./images/racing.jpg", fee:"0.08 Pi", usage:"레이싱 3분", nft:true },
    { name:"낚시", desc:"가상 호수에서 낚시 체험", img:"./images/fishing.jpg", fee:"0.03 Pi", usage:"낚시 5분", nft:false },
    { name:"캠핑", desc:"메타버스 캠핑 체험", img:"./images/camping.jpg", fee:"0.02 Pi", usage:"캠핑 10분", nft:false }
  ];
  renderCards(root, hobbies, renderHobby);
}

function renderCards(root, items, backFunc) {
  root.innerHTML = "";
  items.forEach(item=>{
    const card = document.createElement("div");
    card.className="card";
    card.innerHTML = `<img src="${item.img}" alt="${item.name}"><h2>${item.name}</h2><p>${item.desc}</p><p>사용료: ${item.fee}</p>`;
    card.addEventListener("click", ()=>renderDetail(root,item,backFunc));
    root.appendChild(card);
  });
}

function renderDetail(root,item,backFunc){
  root.innerHTML="";
  const d = document.createElement("div");
  d.className="detail";
  d.innerHTML = `
    <img src="${item.img}" alt="${item.name}">
    <h2>${item.name}</h2>
    <p>${item.desc}</p>
    <p>사용료: ${item.fee}</p>
    <p>사용방법: ${item.usage}</p>
    <p>NFT 필요: ${item.nft ? "예" : "아니오"}</p>
  `;
  const backBtn = document.createElement("button");
  backBtn.className="back-btn";
  backBtn.textContent="← 돌아가기";
  backBtn.addEventListener("click",()=>backFunc(root));
  d.appendChild(backBtn);
  root.appendChild(d);
}
