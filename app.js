// dotenvパッケージを最初に読み込む(GPT推奨)
// dotenvパッケージは、.envファイルの内容を読み込みます。
require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const app = express();
const helmet = require('helmet');

// server.js内で環境変数を取得
const apiUrl = process.env.API_URL;
const PORT = process.env.PORT || 3002; // PORT環境変数が存在しない場合はデフォルト値を使用
const NODE_ENV = process.env.NODE_ENV || 'development';


app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

if (NODE_ENV === 'development') {
  console.log('*** Running in development mode ***');
  // 開発環境特有の設定やミドルウェアをここに追加
} else if (NODE_ENV === 'production') {
  console.log('*** Running in production mode ***');
  // 本番環境特有の設定やミドルウェアをここに追加
}

app.get('/quote', async (req, res) => {
  try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      res.json(randomQuote);
  } catch (error) {
      console.error('Error fetching the author:', error);
      res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running → http://localhost:${PORT}`);
});