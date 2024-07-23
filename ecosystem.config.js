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
