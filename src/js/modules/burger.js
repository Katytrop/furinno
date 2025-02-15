function burger() {
    const burger = document.querySelector('.icon-menu'),
          menu = document.querySelector('.menu__body'),
          body = document.body;

    function openMenu() {
        menu.classList.toggle('_active');
        burger.classList.toggle('_active');
        body.classList.toggle('disable_scroll');
    }
    burger.addEventListener('click', openMenu);

   /*  menu.addEventListener("click",function(e) {
        if((e.target) && (e.target.nodeName == "LI" || e.target.nodeName == "A" || 
        e.target.classList.contains('promo__overlay') || e.target.classList.contains('promo__closeBtn'))){
            menu.classList.remove('active');
            body.classList.remove('disable_scroll');
        }
      }); */
}
burger();