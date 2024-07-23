// logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// ログフォーマットの設定
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: '/home/xs278795/products_test/study_api_famous_quotes/logs/app-out.log' }),
        new transports.File({ filename: '/home/xs278795/products_test/study_api_famous_quotes/logs/app-err.log', level: 'error' })
    ]
});

module.exports = logger;
