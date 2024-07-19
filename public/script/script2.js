

setInterval( () => {
    const d = new Date();
    document.querySelector('.main-date').textContent = d.toLocaleString();  
},1000);