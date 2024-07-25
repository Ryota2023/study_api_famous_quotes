const mainDate = document.querySelector('.main-date');
const new_date = new Date();
mainDate.textContent = new_date.toLocaleString();  

setInterval( () => {
    const new_date = new Date();
    mainDate.textContent = new_date.toLocaleString();  
},1000);