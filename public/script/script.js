let count = false;

//クリックイベントつける時は、これがあったほうが良いみたい
document.addEventListener('DOMContentLoaded', () => {
	// getQuoteボタンのイベントリスナーを設定
	document.getElementById('getQuote').addEventListener('click', () => {
 
  	  // ラジオボタンの値を取得
		const soundForm = document.getElementById('soundForm');
		const selectedRadio = soundForm.querySelector('input[name="radio"]:checked');

		// 音を再生する
	  if (selectedRadio && selectedRadio.value === 'ON') {
		const clickSound = document.getElementById('soundEffect');
		clickSound.play();
	  }
	
	//   fetch('https://xs278795.xsrv.jp/study_api_famous_quotes/quote')
	  fetch('/quote')
		.then(response => {
		  if (response.ok) {
			console.table(response);  //デバッグ用
			return response.json();
		  }
		  throw new Error(`Network response was not ok: ${response.statusText}`);
		})
		.then(data => {
		  const quoteE = document.getElementById('quoteDisplay');
		  const dsp1E = document.createElement('div');
		  const dsp2E = document.createElement('div');
		  dsp1E.innerHTML = `●Name: ${data.author}<br><br>`;
		  dsp2E.innerHTML = `　${data.content}<br><br><hr>`;
  
		  quoteE.appendChild(dsp1E);
		  quoteE.appendChild(dsp2E);
  
		  // 新しい要素にスクロール  
		  dsp2E.scrollIntoView({ behavior: 'smooth' });
		})
		.catch(error => {
		  console.error('エラー発生: fetching the quote:', error);
		  document.getElementById('quoteDisplay').innerText = 'Failed to fetch quote.';
		});
	});
  
	// ラジオボタンのイベントリスナーを設定
	const soundForm = document.getElementById('soundForm');
	soundForm.addEventListener('change', (event) => {
	if (event.target.name === 'radio' && event.target.value === 'ON') {
		if (!count){
			count = true;
			return;	
		} 
		const soundEffect = document.getElementById('soundEffect');
		soundEffect.play();
	} else {
		count = false;
	}
	});
  });