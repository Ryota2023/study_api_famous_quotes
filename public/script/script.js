'use strict';
// 画面のローディング

document.addEventListener('DOMContentLoaded', () => {

   const soundEffect = document.querySelector('#soundEffect'); //音
   const getQuote = document.querySelector('#getQuote'); //検索ボタン

   getQuote.addEventListener('click', async () => {
      try {
                  
         //-------- 先にサウンド判定 --------
         const selectedRadio = document.querySelector('input[name="radio"]:checked');
         if (selectedRadio && selectedRadio.value === 'ON') {
            console.log('Playing sound');
            if (soundEffect) {
               await soundEffect.play().catch(error => {
                  console.error('Error playing the sound:', error);
               });
            }
         }

         //-------- API --------
         console.log('APIリクエスト送信(script.js:23行)');
         const response = await fetch('./quote');
         console.log('APIレスポンス受信(script.js:25行)');

         if (!response.ok) {
            throw new Error(`HTTP response was not ok(script.js:28行): ${response.statusText}`);
         }
         //-------- レスポンス成功 --------
         const data = await response.json();
         displayQuote(data);  //関数側でレスポンスデータ出力処理

      } catch (error) {
         console.error('APIエラー(script.js:35行): ', error);
         document.getElementById('quoteDisplay').innerText = 'データ取得できませんでした';
      }
   });

   // レスポンスデータ出力処理を外に持ってきた
   function displayQuote(data) {
      console.table('*response.json():', data);
      const quoteE = document.querySelector('#quoteDisplay');
      const dsp1E = document.createElement('div');
      const dsp2E = document.createElement('div');
      
      // 出力
      dsp1E.innerHTML = `●Name: ${data.author}<br><br>`;
      dsp1E.style.marginTop = '18px'; // 文字の上に余白を入れる
   
      dsp2E.innerHTML = `　${data.content}`; // 内容のみをセット
      dsp2E.style.marginBottom = '38px'; // 下に余白を追加
   
      // 余白を管理するために適切なスタイルを追加
      dsp1E.style.display = 'block';
      dsp2E.style.display = 'block';
   
      // <hr> 要素を作成
      const hrE = document.createElement('hr');
   
      quoteE.appendChild(dsp1E);
      quoteE.appendChild(dsp2E);
      quoteE.appendChild(hrE); // hr を追加
      dsp2E.scrollIntoView({ behavior: 'smooth' });
   }
   

});
