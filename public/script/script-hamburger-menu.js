'use strict';

// ハンバーガーメニューを閉じる関数（グローバルに公開）
function closeHamburgerMenu() {
   const hamburgerMenu = document.querySelector('.hamburger-menu');
   if (hamburgerMenu) {
      hamburgerMenu.classList.remove('active');
   }
}

// ハンバーガーメニューの機能
document.addEventListener('DOMContentLoaded', () => {
   const hamburgerMenu = document.querySelector('.hamburger-menu');

   if (hamburgerMenu) {
      // ハンバーガーメニューのクリックイベント
      hamburgerMenu.addEventListener('click', () => {
         hamburgerMenu.classList.toggle('active');
      });

      // メニュー外をクリックした時にメニューを閉じる
      document.addEventListener('click', (event) => {
         if (!hamburgerMenu.contains(event.target)) {
            hamburgerMenu.classList.remove('active');
         }
      });

      // メニューアイテムをクリックした時にメニューを閉じる（dataClearとhowToEnjoy以外）
      const menuItems = document.querySelectorAll('.menu-item a:not(#dataClear):not(#howToEnjoy)');
      menuItems.forEach(item => {
         item.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
         });
      });
   }
}); 