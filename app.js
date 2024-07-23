require('dotenv').config();  
// .envファイルに環境変数を設定するために使う
// dotenvパッケージ必ず一番最初に書く

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');  //セキュリティヘッダーの設定

// process.envを通じて.envから環境変数を取得
const apiUrl = process.env.API_URL;
const PORT = process.env.PORT || 3100; // PORT環境変数が存在しない場合はデフォルト値を使用
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`PORT: ${PORT}`);
console.log(`NODE_ENV: ${NODE_ENV}`);

app.use(express.json());
app.use(helmet());

if (NODE_ENV === 'development') {
    // 開発環境用
    app.use('/study_api_famous_quotes', express.static(path.join(__dirname, 'public')));
    app.use(morgan('dev'));
    console.log('*** Running in development mode ***');

    app.get('/study_api_famous_quotes/about', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'about.html'), (err)=> {
            if(err){
                res.status(err.status || 500).end();
            }
        });
    });

    // ルートパスに対するファイル提供
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

} else if (NODE_ENV === 'production') {
    // 本番環境用
    app.use('/study_api_famous_quotes', express.static(path.join(__dirname, 'public')));
    app.use(morgan('combined'));
    app.use(helmet());  //本番環境ではセキュリティーヘッダーを使う
 
    app.get('/study_api_famous_quotes', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'), (err) => {
          if (err) {
              res.status(err.status || 500).send('An error occurred while loading the file.');
          }
      });
    });

    app.get('/study_api_famous_quotes/about', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'about.html'), (err) => {
            if (err) {
                res.status(err.status || 500).send('An error occurred while loading the file.');
            }
        });
    });

    app.use((err, req, res, next) => {
        res.status(500).send('An error occurred. Please try again later.');
    });
}

app.get('/quote', async (req, res) => {
    console.log('quote in!');   //デバック用
    // res.send('Hello world');

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

// 404エラーハンドリングミドルウェア
app.use((req, res, next) => {
  res.status(404).send(`404 not found`);
});

app.listen(PORT, () => {
  console.log(`Server is running → http://localhost:${PORT}`);
});