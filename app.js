//
// 開発環境では、62行目のfetch関数を使う
// 本番環境では、64行目のfetch関数を使う
//
require('dotenv').config();  // .envファイル読込み用
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const morgan = require('morgan');  // ecosystem.config.jsファイル読込み用
const helmet = require('helmet');  // セキュリティ対策
const logger = require('./logger');  //console.logをlogs内に保存する

// .envから環境変数を取得
const apiUrl = process.env.API_URL;
const PORT = process.env.PORT || 3100; // PORT環境変数が存在しない場合は
const NODE_ENV = process.env.NODE_ENV || 'development';

// logs内にconsole.logを保存
console.log(`PORT: ${PORT}`);
console.log(`NODE_ENV: ${NODE_ENV}`);
console.log(`API_URL: ${apiUrl}`);

app.use(express.json());
app.use(helmet());   //セキュリティ対策

if (NODE_ENV === 'development') {
   // 開発環境用
   logger.info('●開発環境に入りました！(app.js:29行)');
   app.use('/', express.static(path.join(__dirname, 'public')));
   app.use(morgan('dev')); //Vscodeコンソールにログ出力

   app.use((req, res, next) => {
      console.log(`req.urlは→ ${req.url}`);
      next();
   });

   app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
   });

} else if (NODE_ENV === 'production') {
   // 本番環境用
   logger.info('●本番環境用に入りました！(app.js:4行)');
   app.use('/study_api_famous_quotes', express.static(path.join(__dirname, 'public')));
   app.use(morgan('combined'));  // リクエストログを記録

   app.use((req, res, next) => {
      logger.info(`●res.urlは(app.js:51行)→ ${req.url}`);
      next();
   });

   app.use((err, req, res, next) => {
      logger.info('app.use((err, req, res, next)にはいりました(app.js:56行)');
      logger.error(err.stack);
      res.status(500).send('An error occurred. Please try again later.');
   });
}

// fetch関数（本番環境用）
app.get('/study_api_famous_quotes/quote', async (req, res) => {
// fetch関数（開発環境用）
// app.get('/quote', async (req, res) => {
   logger.info('●fetch関数内に入りました！(app.js:65行)');   //デバッグ用

   try {
      const response = await fetch('https://raw.githubusercontent.com/quotable-io/data/master/data/quotes.json');
      if (!response.ok) {
         throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      res.json(randomQuote);
   } catch (error) {
      console.error('*Error fetching the author:→ ', error);
      logger.error('*Error fetching the author:→ ', error);
      res.status(500).json({ error: 'Failed to fetch quote' });
   }
});

// 404エラーハンドリングミドルウェア
app.use((req, res, next) => {
   logger.info('●app.use(～ (404 not found))に入りました！(app.js)');   //デバッグ用
   res.status(404).send('404 not found');
});

app.listen(PORT, () => {
   console.log(`●Server is running → http://localhost:${PORT}`);
});
