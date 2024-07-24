module.exports = {
  apps: [{
    name: 'study_api_famous_quotes',
    script: './app.js',
    env: {
      PORT: 3100,
      NODE_ENV: 'production'  
    },
    output: '/home/xs278795/products_test/study_api_famous_quotes/logs/app-out.log',
    error: '/home/xs278795/products_test/study_api_famous_quotes/logs/app-err.log',
  }]
};

//　morgan設定されてるので、
// 本番環境でpm2 start ecosystem.config.jsを実行すると
// このファイルecosystem.config.jsを読みにくる
// このファイルでも、.envで設定している NODE_ENV: 'development'を
// 設定できるが、.gitignoreでgit操作できないようにしている意味がなくなる。

// なので、NODE_ENVの設定は、 
// 開発環境は、.env
// 本番環境は、cosystem.config.js
// で使い分けて設定している。
