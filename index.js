const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, { cors:{ origin:"*" } });

// ENV / CONFIG
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'me2v';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

let db;
MongoClient.connect(MONGO_URL).then(client => {
  db = client.db(DB_NAME);
  console.log('Mongo connected');
}).catch(err=>console.error(err));

// Simple /api/modules (serve catalogue) -- in production this is read from DB
app.get('/api/modules', async (req,res) => {
  // try DB first
  try{
    const mods = await db.collection('modules').find({enabled:true}).toArray();
    if(mods && mods.length) return res.json(mods);
  }catch(e){}
  // fallback demo modules
  res.json([
    {id:'love-park-01', module:'love', title:'공원에서의 첫 만남', visual:'/assets/love-park-01/thumb.jpg', highlight:false},
    {id:'space-mars-01', module:'space', title:'화성 탐험', visual:'/assets/space-mars-01/thumb.jpg', highlight:true}
  ]);
});

// Pi login simulation endpoint — production: verify proof from Pi SDK / wallet
app.post('/api/auth/pi', async (req,res) => {
  const { piId } = req.body;
  if(!piId) return res.status(400).json({error:'piId required'});
  // TODO: PRODUCTION: verify Pi ownership / signature on server side
  const user = { piId, displayName: piId.replace(/^pi_/,'') };
  const token = jwt.sign({ piId }, JWT_SECRET, { expiresIn:'7d' });
  // upsert user in DB
  try{
    await db.collection('users').updateOne({piId}, {$set:{piId, displayName:user.displayName}}, {upsert:true});
  }catch(e){ console.warn(e); }
  res.json({ token, user });
});

app.post('/api/user/progress', async (req,res) => {
  const { token, payload } = req.body;
  // optional: verify JWT
  // TODO: validate payload and store
  try{
    // store under user id
    await db.collection('progress').insertOne({ payload, createdAt: new Date() });
    res.json({ ok:true });
  }catch(e){ res.status(500).json({error:e.message}); }
});

// WebSocket basic: rooms presence
io.on('connection', socket => {
  console.log('ws connected', socket.id);
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit('presence', { id: socket.id, action:'join' });
  });
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    io.to(roomId).emit('presence', { id: socket.id, action:'leave' });
  });
  socket.on('input', (data) => {
    // broadcast to room (server-authoritative logic should be added)
    if(data.room) socket.to(data.room).emit('peerInput', { id: socket.id, payload: data.payload });
  });
  socket.on('disconnect', () => console.log('ws disconnect', socket.id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> console.log('Server running on', PORT));
