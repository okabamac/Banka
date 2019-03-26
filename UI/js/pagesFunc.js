const hamburger = document.querySelector('.hamburger-icon');
const sideMenu = document.querySelector('#sideMenu');

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
});