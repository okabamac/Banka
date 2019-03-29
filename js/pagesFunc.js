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
    hamburger.classList.toggle('close');
    if (mainContent) {
        mainContent.classList.toggle('contentOpened');
    }
    toggle(sideMenu);
});



window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        if (hamburger.classList.contains('close')) {
            hamburger.classList.remove('close');
        }
        if (mainContent.classList.contains('contentOpened')) {
            mainContent.classList.remove('contentOpened');
        }
        if (sideMenu.style.display == 'none') {
            sideMenu.style.display = 'block';
        }
    } else {
        if (hamburger.classList.contains('close') === false) {
            sideMenu.style.display = 'none';
        } else {
            sideMenu.style.display = 'block';
        }
    }
}, true);




// const searchBtn = document.getElementById('search-btn');
// const search = document.getElementById('search');
// const tip = document.getElementById('tip');

// if (searchBtn) {

//     searchBtn.addEventListener('click', () => {
//         search.style.width = '200px';
//         search.style.padding = '40px';
//         search.style.cursor = 'text';
//         search.focus();

//         search.setAttribute('placeholder', 'Enter Ref');
//     });

// }

(function () {
    const notification = document.querySelector('#notification');
    notification.classList.add('animate');
})();