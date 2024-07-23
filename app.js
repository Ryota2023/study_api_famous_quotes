// 更新：　2024/7/34 15:25

require('dotenv').config();  // .envファイル読込みに必要

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const morgan = require('morgan');  //ecosystem.config.jsファイル読込みに必要
const helmet = require('helmet');  //セキュリティヘッダーの設定

// .envから環境変数を取得
const apiUrl = process.env.API_URL;
const PORT = process.env.PORT || 3100; // PORT環境変数が存在しない場合はデフォルト値を使用
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`PORT: ${PORT}`);
console.log(`NODE_ENV: ${NODE_ENV}`);
console.log(`API_URL: ${apiUrl}`);

app.use(express.json());
app.use(helmet());

if (NODE_ENV === 'development') {
    console.log('開発環境：');
    // 開発環境用
    app.use('/', express.static(path.join(__dirname, 'public')));
    app.use(morgan('dev'));
    console.log('*** Running in development mode ***');

    app.get('/about', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'about.html'), (err) => {
        });
    });

    // ルートパスに対するファイル提供
    // app.get('/', (req, res) => {
    //     res.sendFile(path.join(__dirname, 'public', 'index.html'));
    // });

    app.use((req, res, next) => {
        console.log(`Received request for: ${req.url}`);
        next();
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

} else if (NODE_ENV === 'production') {
    console.log('本番環境：');
    // 本番環境用
    app.use('/', express.static(path.join(__dirname, 'public')));
    app.use(morgan('combined'));  // 本番環境でリクエストログを記録
    app.use(helmet());  //本番環境ではセキュリティーヘッダーを使う

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
            if (err) {
                console.error('Error sending index.html:', err);
            }
        });
    });

    app.get('/about', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'about.html'), (err) => {
            if (err) {
                console.error('Error sending about.html:', err);
            }
        });
    });

    app.use((req, res, next) => {
        console.log(`Received request for: ${req.url}`);
        next();
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('An error occurred. Please try again later.');
    });
}

// fetch関数
app.get('/quote', async (req, res) => {
    console.log('quote in!');   //デバック用

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