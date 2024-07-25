document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('getQuote').addEventListener('click', async () => {
        try {
            const soundForm = document.getElementById('soundForm');
            const selectedRadio = soundForm.querySelector('input[name="radio"]:checked');
            const clickSound = document.getElementById('soundEffect');

            if (selectedRadio && selectedRadio.value === 'ON') {
                if (clickSound) {
                    await clickSound.play().catch(error => {
                        console.error('Error playing the sound:', error);
                    });
                }
            }

            const response = await fetch('./quote');
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            displayQuote(data);
        } catch (error) {
            console.error('エラー発生: fetching the quote:', error);
            document.getElementById('quoteDisplay').innerText = 'Failed to fetch quote.';
        }
    });

    function displayQuote(data) {
        const quoteE = document.getElementById('quoteDisplay');
        const dsp1E = document.createElement('div');
        const dsp2E = document.createElement('div');
        dsp1E.innerHTML = `●Name: ${data.author}<br><br>`;
        dsp2E.innerHTML = `　${data.content}<br><br><hr>`;

        quoteE.appendChild(dsp1E);
        quoteE.appendChild(dsp2E);

        dsp2E.scrollIntoView({ behavior: 'smooth' });
    }

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
