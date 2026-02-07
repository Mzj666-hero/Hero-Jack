const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 默认数据
const anchorList = [
    { id:1, name:"主播一号", score:9880 },
    { id:2, name:"主播二号", score:8560 },
    { id:3, name:"主播三号", score:7220 },
    { id:4, name:"主播四号", score:5640 },
    { id:5, name:"主播五号", score:3210 }
];

const viewerList = [
    { id:1, name:"用户小明", score:12800 },
    { id:2, name:"用户小红", score:10500 },
    { id:3, name:"用户小刚", score:8600 },
    { id:4, name:"用户小丽", score:6200 },
    { id:5, name:"用户小强", score:4100 }
];

// 接口
app.get('/api/anchors', (req, res) => {
    res.json({ data: anchorList });
});

app.get('/api/viewers', (req, res) => {
    res.json({ data: viewerList });
});

// 首页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动端口
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log('服务启动成功，端口：', PORT);
});