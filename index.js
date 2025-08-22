require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 4000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// health
app.get('/', (req,res)=> res.json({ ok:true, server:'me2verse' }));

/** USERS **/
app.post('/api/users', async (req,res)=>{
  const { name, pi_wallet } = req.body;
  try{
    const r = await pool.query(`INSERT INTO users (id,name,pi_wallet) VALUES ($1,$2,$3) RETURNING *`, [uuidv4(), name, pi_wallet]);
    res.json(r.rows[0]);
  }catch(err){ console.error(err); res.status(500).json({error:'user create failed'}) }
});

app.get('/api/users/:id', async (req,res)=>{
  const id = req.params.id;
  try{
    const r = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
    res.json(r.rows[0]||null);
  }catch(err){ res.status(500).json({error:'user fetch failed'})}
});

/** STORIES (seed via client or DB script) **/
app.get('/api/stories', async (req,res)=>{
  try{
    const r = await pool.query(`SELECT * FROM stories ORDER BY created_at DESC`);
    res.json(r.rows);
  }catch(err){ res.status(500).json({error:'stories fetch failed'})}
});

app.get('/api/stories/:id', async (req,res)=>{
  const id = req.params.id;
  try{
    const r = await pool.query(`SELECT * FROM stories WHERE id=$1`, [id]);
    res.json(r.rows[0]||null);
  }catch(err){ res.status(500).json({error:'story fetch failed'})}
});

app.post('/api/stories', async (req,res)=>{
  // Admin-only in real app
  const s = req.body;
  try{
    await pool.query(
      `INSERT INTO stories (id,module,title,synopsis,diff,length_min,is_premium,reward,steps,tags) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [s.id, s.module||'custom', s.title, s.synopsis, s.diff||'보통', s.length_min||8, s.is_premium||false, s.reward||{}, s.steps||[], s.tags||[]]
    );
    res.json({ ok:true });
  }catch(err){ console.error(err); res.status(500).json({error:'story insert failed'})}
});

/** SUBMISSIONS (user proposed stories) **/
app.post('/api/submissions', async (req,res)=>{
  const { user_id, title, synopsis, tags, is_premium } = req.body;
  try {
    const r = await pool.query(`INSERT INTO submissions (id,user_id,title,synopsis,tags,is_premium) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [uuidv4(), user_id || null, title, synopsis, tags || [], is_premium || false]);
    res.json(r.rows[0]);
  } catch(err){ console.error(err); res.status(500).json({error:'submission failed'}) }
});

// admin: accept submission -> create story
app.post('/api/submissions/:id/accept', async (req,res)=>{
  const id = req.params.id;
  try{
    const r = await pool.query(`SELECT * FROM submissions WHERE id=$1`, [id]);
    const sub = r.rows[0];
    if(!sub) return res.status(404).json({error:'not found'});
    const storyId = (sub.title.replace(/\s+/g,'_') + '_' + Date.now()).slice(0,200);
    const story = {
      id: storyId,
      module: 'romance',
      title: sub.title,
      synopsis: sub.synopsis,
      diff: '보통',
      length_min: 8,
      is_premium: sub.is_premium,
      reward: { points:10, items: ['유저제안보상'] },
      steps: [{title:'사용자제안 기본', a:'진행','b':'보류'}]
    };
    await pool.query(`INSERT INTO stories (id,module,title,synopsis,diff,length_min,is_premium,reward,steps,tags) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [story.id, story.module, story.title, story.synopsis, story.diff, story.length_min, story.is_premium, story.reward, story.steps, []]);
    await pool.query(`UPDATE submissions SET status='accepted' WHERE id=$1`, [id]);
    res.json({ ok:true, storyId });
  }catch(err){ console.error(err); res.status(500).json({error:'accept failed'})}
});

/** EXPERIENCES (save user runs) **/
app.post('/api/experiences', async (req,res)=>{
  const { user_id, story_id, choices, points, items, emotions, snapshot_urls } = req.body;
  try{
    const r = await pool.query(`INSERT INTO experiences (id,user_id,story_id,choices,points,items,emotions,snapshot_urls) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [uuidv4(), user_id || null, story_id, choices || {}, points || 0, items || [], emotions || {}, snapshot_urls || []]);
    res.json(r.rows[0]);
  }catch(err){ console.error(err); res.status(500).json({error:'save experience failed'})}
});

app.get('/api/experiences/:userId', async (req,res)=>{
  const uid = req.params.userId;
  try{
    const r = await pool.query(`SELECT * FROM experiences WHERE user_id=$1 ORDER BY created_at DESC`, [uid]);
    res.json(r.rows);
  }catch(err){ res.status(500).json({error:'fetch experiences failed'})}
});

/** TRANSACTIONS + Pi verification (SIMULATED) **/
app.post('/api/transactions/pi', async (req,res)=>{
  // expected: { user_id, amount_pi, proofTxHash }
  const { user_id, amount_pi, proofTxHash } = req.body;
  // NOTE: Put Pi Network verification here in production.
  // For demo we accept any tx and mark it 'confirmed'
  try{
    const r = await pool.query(`INSERT INTO transactions (id,user_id,amount_pi,type,status,tx_hash) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [uuidv4(), user_id || null, amount_pi, 'pi_payment', 'confirmed', proofTxHash || 'demo_'+Date.now()]);
    res.json({ ok:true, tx: r.rows[0] });
  }catch(err){ res.status(500).json({error:'transaction failed'})}
});

/** Simple search endpoint */
app.get('/api/search', async (req,res)=>{
  const q = (req.query.q || '').toLowerCase();
  try{
    const r = await pool.query(`SELECT * FROM stories WHERE lower(title) LIKE $1 OR lower(synopsis) LIKE $1`, [`%${q}%`]);
    res.json(r.rows);
  }catch(err){ res.status(500).json({error:'search failed'})}
});

app.listen(PORT, ()=> console.log(`Me2Verse server listening ${PORT}`));
