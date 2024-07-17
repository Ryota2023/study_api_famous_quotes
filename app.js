// dotenvパッケージは最初に読み込む(GPT推奨)
// dotenvパッケージは、.envファイルの内容を読み込む
require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');  //セキュリティヘッダーを設定する

// server.js内で環境変数を取得
const apiUrl = process.env.API_URL;
const PORT = process.env.PORT || 3002; // PORT環境変数が存在しない場合はデフォルト値を使用
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

// 開発環境と本番環境の切り替え
if (NODE_ENV === 'development') {
    // 開発環境特有の設定やミドルウェアをここに追加
    app.use(morgan('dev'));
    console.log('*** Running in development mode ***');

    app.get('/about', (req, res) => {
      res.sendFile(__dirname + '/public/about.html');
      });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
} else if (NODE_ENV === 'production') {
    // 本番環境特有の設定やミドルウェアをここに追加
    app.use(morgan('combined'));
    app.use(helmet());  //本番環境ではセキュリティーヘッダーを使う
 
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/public/index.html');
      });

    app.get('/study_api_famous_quotes/about', (req, res) => {
      res.sendFile(__dirname + '/public/about.html');
      });

    app.use((err, req, res, next) => {
        res.status(500).send('An error occurred. Please try again later.');
    });
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