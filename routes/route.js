// 
const path = require('path');

exports.testGamen = function (req, res) {
   const data = { title: "画像テスト" };
   res.render('test_img', data);
}

exports.newImage = function (req, res) {
   const imagePath = path.join(__dirname, '../stock/img', 'na6.jpg');
   res.sendFile(imagePath);
}

