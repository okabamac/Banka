
(function () {
    let greeting;
    const hour = new Date().getHours();
    if (hour < 12) {
        greeting = 'Goodmorning,';
    }
    else if ((hour >= 12) && (hour < 16)) {
        greeting = 'Goodafternoon,';
    }
    else {
        greeting = 'Goodevening,';
    }
    document.getElementById('day').innerHTML = greeting;
})();

const signinBtn = document.getElementById('signinBtn');
const signupBtn = document.getElementById('signupBtn');

const closeSignin = document.querySelectorAll('#closeBtn')[0];
const closeSignup = document.querySelectorAll('#closeBtn')[1];

const signinModal = document.getElementById('signinModal');
const signupModal = document.getElementById('signupModal');


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
    showOrHide(signinModal, 'none');
});
closeSignup.addEventListener('click', () => {
    showOrHide(signupModal, 'none');
});

window.addEventListener('click', (e) => {
    if (e.target == signinModal || e.target == signupModal) 
       showOrHide(e.target, 'none');
});

