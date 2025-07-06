'use strict';

// 開発環境、本番環境でfetchのエンドポイントを切り替えること
// 画面のローディング

document.addEventListener('DOMContentLoaded', () => {

   const soundEffect = document.querySelector('#soundEffect'); //音
   const getQuote = document.querySelector('#getQuote'); //検索ボタン
   const selectedRadio = document.querySelector('input[name="radio"]:checked');
   if (selectedRadio) {
      console.log(selectedRadio.value);  // 'ON' もしくは 'OFF'
   }

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

         //-------- Fetch API --------
         //本番環境と開発環境でエンドポイントを自動で切り替える
         let apiEndpoint;
         apiEndpoint = './quote';

         // if (window.location.hostname === 'localhost') {
         // 開発環境の場合
         //    apiEndpoint = './quote';
         // } else {
         // 本番環境の場合
         //    apiEndpoint = 'https://xs278795.xsrv.jp/study_api_famous_quotes/quote';
         // }
         console.log('hostname: ', window.location.hostname);
         console.log('API:リクエスト送信(script.js)');
         const response = await fetch(apiEndpoint);
         console.log('API:レスポンス受信(script.js)');

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

   // ローカルストレージから名言データを取得
   function getStoredQuotes() {
      const stored = localStorage.getItem('famousQuotes');
      return stored ? JSON.parse(stored) : [];
   }

   // ローカルストレージに名言データを保存
   function saveQuoteToStorage(data) {
      const quotes = getStoredQuotes();
      const newQuote = {
         id: Date.now(),           // タイムスタンプをIDとして使用
         author: data.author,      // 著者名
         content: data.content,    // 名言の内容
         timestamp: new Date().toISOString()  // 保存時刻
      };

      // 新しいデータを配列の末尾に追加
      quotes.push(newQuote);

      // 最大50件まで保存（古いデータを削除）
      if (quotes.length > 50) {
         quotes.splice(0, quotes.length - 50);
      }

      localStorage.setItem('famousQuotes', JSON.stringify(quotes));
      return newQuote;
   }

   // ローカルストレージのデータを表示
   function displayStoredQuotes() {
      const quoteE = document.querySelector('#quoteDisplay');
      const quotes = getStoredQuotes();

      // 既存の表示をクリア
      quoteE.innerHTML = '';

      if (quotes.length === 0) {
         quoteE.innerHTML = '<p>まだ名言が保存されていません。</p>';
         return;
      }

      quotes.forEach((quote, index) => {
         const dsp1E = document.createElement('div');
         const dsp2E = document.createElement('div');
         const hrE = document.createElement('hr');

         // 出力
         dsp1E.innerHTML = `●Name: ${quote.author}<br><br>`;
         dsp1E.style.marginTop = '18px'; // 文字の上に余白を入れる

         dsp2E.innerHTML = `　${quote.content}`; // 内容のみをセット
         dsp2E.style.marginBottom = '38px'; // 下に余白を追加
         dsp2E.style.fontStyle = 'italic';  // ← ここを追加（イタリック体）

         // 余白を管理するために適切なスタイルを追加
         dsp1E.style.display = 'block';
         dsp2E.style.display = 'block';

         quoteE.appendChild(dsp1E);
         quoteE.appendChild(dsp2E);
         quoteE.appendChild(hrE); // hr を追加
      });
   }

   // レスポンスデータ出力処理を外に持ってきた
   function displayQuote(data) {
      console.table('response.json(): ', data);

      // ローカルストレージに保存
      const savedQuote = saveQuoteToStorage(data);

      // 保存されたデータを表示
      displayStoredQuotes();

      // 最新の要素までスクロール（一番下の要素）
      const quoteE = document.querySelector('#quoteDisplay');
      if (quoteE.children.length > 0) {
         quoteE.children[quoteE.children.length - 1].scrollIntoView({ behavior: 'smooth' });
      }
   }

   // ページ読み込み時に保存されたデータを表示
   displayStoredQuotes();

   // how to enjoy機能
   const howToEnjoyButton = document.querySelector('#howToEnjoy');
   if (howToEnjoyButton) {
      howToEnjoyButton.addEventListener('click', (e) => {
         e.preventDefault(); // デフォルトのリンク動作を防ぐ
         e.stopPropagation(); // イベントの伝播を停止

         const message = `世界の著名人たちの名言を、ランダムに表示するシンプルなWebアプリです。
ボタンをクリックすると、新しい名言が表示されます。
表示された名言は、お使いの端末に自動保存されるため、いつでも再アクセスして確認できます。
保存データを削除する場合は、メニューの「Delete Clear」から削除できます。
それでは、素敵な名言との出会いをお楽しみください。`;

         // モーダルウィンドウを表示（自動閉じない）
         showModal(message, false, 'how-to-enjoy');

         // ハンバーガーメニューを閉じる
         closeHamburgerMenu();
      });
   }

   // モーダルウィンドウのクリックで閉じる
   const modal = document.querySelector('#modal');
   if (modal) {
      modal.addEventListener('click', (e) => {
         // モーダルウィンドウ内のどこをクリックしても閉じる
         closeModal();
      });
   }

   // データクリア機能
   const dataClearButton = document.querySelector('#dataClear');
   if (dataClearButton) {
      dataClearButton.addEventListener('click', (e) => {
         e.preventDefault(); // デフォルトのリンク動作を防ぐ
         e.stopPropagation(); // イベントの伝播を停止

         // 確認ダイアログを表示
         const isConfirmed = confirm('保存している名言を削除しますか？');

         if (isConfirmed) {
            try {
               // ローカルストレージのデータを削除
               localStorage.removeItem('famousQuotes');

               // 表示をクリア
               displayStoredQuotes();

               // ハンバーガーメニューを閉じる
               closeHamburgerMenu();

               // 成功メッセージを表示
               showModal('削除しました', true, 'data-clear');
            } catch (error) {
               console.error('データ削除エラー:', error);

               // 失敗メッセージを表示
               showModal('削除に失敗しました', true, 'data-clear');
            }
         } else {
            // ハンバーガーメニューを閉じる
            closeHamburgerMenu();

         }
      });
   }

   // モーダルウィンドウを表示する関数
   function showModal(message, autoClose = true, type = '') {
      const modal = document.querySelector('#modal');
      const modalMessage = document.querySelector('#modalMessage');
      const modalContent = document.querySelector('.modal-content');

      if (modal && modalMessage && modalContent) {
         // 既存のクラスをクリア
         modalContent.classList.remove('how-to-enjoy', 'data-clear');
         
         // タイプに応じてクラスを追加
         if (type === 'how-to-enjoy') {
            modalContent.classList.add('how-to-enjoy');
         } else if (type === 'data-clear') {
            modalContent.classList.add('data-clear');
         }
         
         modalMessage.textContent = message;
         modal.style.display = 'block';

         // 自動閉じる場合のみタイマーを設定
         if (autoClose) {
            setTimeout(() => {
               modal.style.display = 'none';
            }, 1200);
         }
      }
   }

   // モーダルウィンドウを閉じる関数
   function closeModal() {
      const modal = document.querySelector('#modal');
      if (modal) {
         modal.style.display = 'none';
      }
   }


});
