const hamburger = document.querySelector('.hamburger-icon');
const sideMenu = document.querySelector('#sideMenu');
const mainContent = document.querySelector('#mainContent');

let show = false;

const toggle = (el) => {
    if (show === true) {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
};


hamburger.addEventListener('click', () => {
    show = !show;
    toggle(sideMenu);
    hamburger.classList.toggle('close');
    if(mainContent){
        mainContent.classList.toggle('contentOpened');
    }
});



window.addEventListener("resize",  () => {
    console.log(sideMenu.style.display);
  if (window.innerWidth > 700) {
              if(mainContent.classList.contains('contentOpened')){
                  mainContent.classList.remove('contentOpened');
                  sideMenu.style.display = 'block';
              }
            else {
                if (hamburger.classList.contains('close')) {
                    hamburger.classList.remove('close');
                }
                if(hamburger.classList.contains('close') == false && window.innerWidth < 700 ){
                    sideMenu.style.display = 'none';
                }
            }
          }
}, true);



(function () {
    const notification = document.querySelector('#notification');
    notification.classList.add('animate');
})();