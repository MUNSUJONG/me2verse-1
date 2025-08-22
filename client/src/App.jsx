import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function App(){
  const [stories, setStories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState('');
  const [amount, setAmount] = useState(1);
  const [points, setPoints] = useState(0);

  useEffect(()=> { fetchStories(); }, []);

  async function fetchStories(){
    const r = await axios.get(`${API}/stories`);
    setStories(r.data);
  }

  async function loginAndPay(){
    if(!user) return alert('유저 이름 필요');
    // create user (naive)
    const r = await axios.post(`${API}/users`, { name: user });
    // simulate Pi transaction
    await axios.post(`${API}/transactions/pi`, { user_id: r.data.id, amount_pi: amount, proofTxHash: 'demo_' + Date.now() });
    setPoints(p => p + (amount * 5));
    alert('로그인 + Pi 결제 완료');
  }

  function openStory(s){
    setSelected(s);
  }

  async function completeStory(){
    if(!selected) return;
    // simulate save experience
    await axios.post(`${API}/experiences`, { user_id:null, story_id:selected.id, points: selected.reward?.points || 10, items: selected.reward?.items || [] });
    setSelected(null);
    alert('스토리 완료 기록 저장');
  }

  return (<div style={{maxWidth:1100, margin:'20px auto', padding:20}}>
    <header style={{display:'flex', gap:12, alignItems:'center'}}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg" style={{width:80}}/>
      <h1 style={{flex:1}}>Me2Verse</h1>
      <div>
        <input placeholder="유저명" value={user} onChange={e=>setUser(e.target.value)} />
        <select value={amount} onChange={e=>setAmount(Number(e.target.value))}>
          <option value={1}>1 Pi</option><option value={5}>5 Pi</option>
        </select>
        <button onClick={loginAndPay}>자동 로그인 + 결제</button>
      </div>
    </header>

    <main style={{display:'grid', gridTemplateColumns:'1fr 380px', gap:16, marginTop:18}}>
      <section>
        <h2>스토리</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12}}>
          {stories.map(s=> (
            <article key={s.id} style={{border:'1px solid #eee', padding:12, borderRadius:8}}>
              <h3>{s.title}</h3>
              <p style={{color:'#666'}}>{s.synopsis}</p>
              <div style={{display:'flex', gap:8}}>
                <button onClick={()=>openStory(s)}>시작</button>
                <button style={{background:'#eee'}} onClick={()=>alert('찜(데모)')}>❤ 찜</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside>
        <div style={{background:'#fff', padding:12, borderRadius:8}}>
          <h3>내 정보</h3>
          <div>포인트: {points}</div>
          <div style={{marginTop:8}}>
            <h4>제안하기</h4>
            <StorySubmit onSubmit={()=>alert('서버 제출(예시)')} />
          </div>
        </div>
      </aside>
    </main>

    {selected && <div style={{position:'fixed', right:20, bottom:20, background:'#fff', padding:12, borderRadius:8}}>
      <h4>{selected.title}</h4>
      <p style={{color:'#666'}}>{selected.synopsis}</p>
      <button onClick={completeStory}>완료 처리</button>
      <button onClick={()=>setSelected(null)} style={{marginLeft:8}}>닫기</button>
    </div>}
  </div>);
}

function StorySubmit({ onSubmit }){
  const [title,setTitle]=useState(''), [syn,setSyn]=useState('');
  return (<div>
    <input placeholder="제목" value={title} onChange={e=>setTitle(e.target.value)} /><br/>
    <textarea placeholder="시놉시스" value={syn} onChange={e=>setSyn(e.target.value)} style={{width:'100%',height:80}}/>
    <button onClick={()=>{ onSubmit({title,syn}); alert('제출됨 (데모)'); setTitle(''); setSyn(''); }}>제출</button>
  </div>);
        }
