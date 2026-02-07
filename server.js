const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database');
});

db.run(`CREATE TABLE IF NOT EXISTS anchors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  avatar TEXT NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS viewers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  avatar TEXT NOT NULL
)`);

const initData = () => {
  db.get("SELECT COUNT(*) as count FROM anchors", (err, row) => {
    if (row.count === 0) {
      const anchors = [
        {name:"小甜甜", score:98500, avatar:"甜"},
        {name:"电竞老王", score:87200, avatar:"王"},
        {name:"音乐小宇", score:76100, avatar:"宇"},
        {name:"搞笑阿凯", score:65300, avatar:"凯"},
        {name:"户外阿泽", score:54800, avatar:"泽"}
      ];
      anchors.forEach(item => {
        db.run("INSERT INTO anchors (name, score, avatar) VALUES (?, ?, ?)", 
          [item.name, item.score, item.avatar]);
      });
    }
  });

  db.get("SELECT COUNT(*) as count FROM viewers", (err, row) => {
    if (row.count === 0) {
      const viewers = [
        {name:"土豪哥", score:128000, avatar:"豪"},
        {name:"守护天使", score:105000, avatar:"使"},
        {name:"铁粉小夏", score:92000, avatar:"夏"},
        {name:"路人甲", score:78500, avatar:"甲"},
        {name:"吃瓜群众", score:66200, avatar:"瓜"}
      ];
      viewers.forEach(item => {
        db.run("INSERT INTO viewers (name, score, avatar) VALUES (?, ?, ?)", 
          [item.name, item.score, item.avatar]);
      });
    }
  });
};
initData();

app.get('/api/anchors', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const keyword = req.query.keyword || '';
  const sql = `SELECT * FROM anchors WHERE name LIKE ? ORDER BY score DESC LIMIT ? OFFSET ?`;
  db.all(sql, [`%${keyword}%`, limit, offset], (err, rows) => {
    if (err) res.status(500).json({error: err.message});
    else {
      db.get("SELECT COUNT(*) as total FROM anchors WHERE name LIKE ?", [`%${keyword}%`], (err, count) => {
        res.json({data: rows, total: count.total});
      });
    }
  });
});

app.get('/api/viewers', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const keyword = req.query.keyword || '';
  const sql = `SELECT * FROM viewers WHERE name LIKE ? ORDER BY score DESC LIMIT ? OFFSET ?`;
  db.all(sql, [`%${keyword}%`, limit, offset], (err, rows) => {
    if (err) res.status(500).json({error: err.message});
    else {
      db.get("SELECT COUNT(*) as total FROM viewers WHERE name LIKE ?", [`%${keyword}%`], (err, count) => {
        res.json({data: rows, total: count.total});
      });
    }
  });
});

app.post('/api/anchors', (req, res) => {
  const { name, score, avatar } = req.body;
  db.run("INSERT INTO anchors (name, score, avatar) VALUES (?, ?, ?)",
    [name, score, avatar], function(err) {
      if (err) res.status(500).json({error: err.message});
      else res.json({id: this.lastID, message: "添加成功"});
    });
});

app.put('/api/anchors/:id', (req, res) => {
  const { name, score, avatar } = req.body;
  db.run("UPDATE anchors SET name=?, score=?, avatar=? WHERE id=?",
    [name, score, avatar, req.params.id], function(err) {
      if (err) res.status(500).json({error: err.message});
      else res.json({message: "修改成功"});
    });
});

app.delete('/api/anchors/:id', (req, res) => {
  db.run("DELETE FROM anchors WHERE id=?", req.params.id, function(err) {
    if (err) res.status(500).json({error: err.message});
    else res.json({message: "删除成功"});
  });
});

app.post('/api/viewers', (req, res) => {
  const { name, score, avatar } = req.body;
  db.run("INSERT INTO viewers (name, score, avatar) VALUES (?, ?, ?)",
    [name, score, avatar], function(err) {
      if (err) res.status(500).json({error: err.message});
      else res.json({id: this.lastID, message: "添加成功"});
    });
});

app.put('/api/viewers/:id', (req, res) => {
  const { name, score, avatar } = req.body;
  db.run("UPDATE viewers SET name=?, score=?, avatar=? WHERE id=?",
    [name, score, avatar, req.params.id], function(err) {
      if (err) res.status(500).json({error: err.message});
      else res.json({message: "修改成功"});
    });
});

app.delete('/api/viewers/:id', (req, res) => {
  db.run("DELETE FROM viewers WHERE id=?", req.params.id, function(err) {
    if (err) res.status(500).json({error: err.message});
    else res.json({message: "删除成功"});
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});