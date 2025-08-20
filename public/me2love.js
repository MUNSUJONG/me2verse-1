// me2love.js
export function renderLove(root){
  const loves=[
    {name:"연애",desc:"가상 연애 체험",img:"./images/love.jpg",fee:"0.05 Pi",usage:"연애 체험 5분",nft:true},
    {name:"결혼",desc:"메타버스 결혼식 체험",img:"./images/wedding.jpg",fee:"0.1 Pi",usage:"결혼식 체험 10분",nft:true}
  ];
  renderCards(root,loves,renderLove);
}

function renderCards(root,items,backFunc){
  root.innerHTML="";
  items.forEach(item=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`<img src="${item.img}" alt="${item.name}"><h2>${item.name}</h2><p>${item.desc}</p><p>사용료: ${item.fee}</p>`;
    card.addEventListener("click",()=>renderDetail(root,item,backFunc));
    root.appendChild(card);
  });
}

function renderDetail(root,item,backFunc){
  root.innerHTML="";
  const d=document.createElement("div");
  d.className="detail";
  d.innerHTML=`
    <img src="${item.img}" alt="${item.name}">
    <h2>${item.name}</h2>
    <p>${item.desc}</p>
    <p>사용료: ${item.fee}</p>
    <p>사용방법: ${item.usage}</p>
    <p>NFT 필요: ${item.nft?"예":"아니오"}</p>
    <div class="simulation" id="simulation">체험 준비 중...</div>
  `;
  const backBtn=document.createElement("button");
  backBtn.className="back-btn";
  backBtn.textContent="← 돌아가기";
  backBtn.addEventListener("click",()=>backFunc(root));
  d.appendChild(backBtn);
  root.appendChild(d);

  simulateExperience(item);
}

function simulateExperience(item){
  const sim=document.getElementById("simulation");
  sim.textContent=`${item.name} 체험 시작!`;
  let progress=0;
  const interval=setInterval(()=>{
    progress+=10;
    sim.textContent=`${item.name} 체험 중... ${progress}%`;
    if(progress>=100){
      clearInterval(interval);
      sim.textContent=`${item.name} 체험 완료! NFT 소유: ${item.nft?"가능":"불가"}`;
    }
  },300);
}
