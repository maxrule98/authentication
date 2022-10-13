const loginForm = document.querySelector('#loginForm');
const registerForm = document.querySelector('#registerForm');
const loginBtn = document.querySelector('#loginBtn');
const registerBtn = document.querySelector('#registerBtn');

console.log(window.location.pathname);

if (window.location.pathname==='/login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
}

if (window.location.pathname==='/register') {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let url = '/api/v1/login';
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: new FormData(loginForm)
    };
    const response = await fetch(url, options);
    console.log(response);
})

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let url = ''
})