
const signinBtn = document.getElementById('signinBtn');
const signupBtn = document.getElementById('signupBtn');

const closeSignin = document.querySelectorAll('#closeBtn')[0];
const closeSignup = document.querySelectorAll('#closeBtn')[1];

const signinModal = document.getElementById('signinModal');
const signupModal = document.getElementById('signupModal');
const modalOverlay1 = document.querySelectorAll('.modalOverlay')[0];
const modalOverlay2 = document.querySelectorAll('.modalOverlay')[1];


const showOrHide = (elem, visibility) => {
    elem.style.display = visibility;
};
const openSigninModal = () => {
  showOrHide(signinModal, 'block');
};
const openSignupModal = () => {
    showOrHide(signupModal, 'block');
};

signinBtn.addEventListener('click', openSigninModal);
signupBtn.addEventListener('click', openSignupModal);

closeSignin.addEventListener('click', () => {
    if(signinModal)
    showOrHide(signinModal, 'none');
});
closeSignup.addEventListener('click', () => {
    if(signupModal)
    showOrHide(signupModal, 'none');
});

window.addEventListener('click', (e) => {
    if (e.target == modalOverlay1 || e.target == modalOverlay2 ) 
       showOrHide(e.target.parentNode, 'none');
});

(function () {
    let greeting;
    const hour = new Date().getHours();
    if (hour < 12) {
        greeting = 'Good Morning,';
    } else if ((hour >= 12) && (hour < 16)) {
        greeting = 'Good Afternoon,';
    } else {
        greeting = 'Good Evening,';
    }
    document.getElementById('day').innerHTML = greeting;
})();

