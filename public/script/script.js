document.addEventListener('DOMContentLoaded', () => {
    const clickSound = document.getElementById('soundEffect');
    if (clickSound) {
        clickSound.addEventListener('canplaythrough', () => {
            console.log('Sound can play through without stopping.');
        }, false);
        clickSound.addEventListener('error', (e) => {
            console.error('Error occurred while loading the sound:', e);
        }, false);
    }

    document.getElementById('getQuote').addEventListener('click', () => {
        const soundForm = document.getElementById('soundForm');
        const selectedRadio = soundForm.querySelector('input[name="radio"]:checked');

        if (selectedRadio && selectedRadio.value === 'ON') {
            if (clickSound) {
                clickSound.play().catch(error => {
                    console.error('Error playing the sound:', error);
                });
            }
        }

        fetch('./quote')
            .then(response => {
                if (response.ok) {
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
    
                dsp2E.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                console.error('エラー発生: fetching the quote:', error);
                document.getElementById('quoteDisplay').innerText = 'Failed to fetch quote.';
            });
    });

    const soundForm = document.getElementById('soundForm');
    soundForm.addEventListener('change', (event) => {
        if (event.target.name === 'radio' && event.target.value === 'ON') {
            if (!count) {
                count = true;
                return;
            }
            const soundEffect = document.getElementById('soundEffect');
            if (soundEffect) {
                soundEffect.play().catch(error => {
                    console.error('Error playing the sound:', error);
                });
            }
        } else {
            count = false;
        }
    });
});
