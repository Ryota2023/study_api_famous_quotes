// dotenvパッケージを最初に読み込む(GPT推奨)
require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const app = express();
const helmet = require('helmet');

// server.js内で環境変数を取得
const apiUrl = process.env.API_URL;
const PORT = process.env.PORT || 3002;


app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

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