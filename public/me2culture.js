// me2culture.js
export function renderCulture(root){
  const cultures=[
    {name:"음악",desc:"메타버스 콘서트 관람",img:"./images/music.jpg",fee:"0.04 Pi",usage:"콘서트 5분",nft:true},
    {name:"영화",desc:"가상 영화관 체험",img:"./images/movie.jpg",fee:"0.03 Pi",usage:"영화 10분",nft:false},
    {name:"전시",desc:"가상 전시회 관람",img:"./images/exhibition.jpg",fee:"0.02 Pi",usage:"전시 7분",nft:false}
  ];
  renderCards(root,cultures,renderCulture);
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
