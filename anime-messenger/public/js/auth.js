// Create animated background
function createSakura() {
    const bgAnimation = document.getElementById('bg-animation');
    for (let i = 0; i < 20; i++) {
        const sakura = document.createElement('div');
        sakura.className = 'sakura';
        sakura.style.left = Math.random() * 100 + '%';
        sakura.style.animationDuration = (Math.random() * 3 + 5) + 's';
        sakura.style.animationDelay = Math.random() * 5 + 's';
        bgAnimation.appendChild(sakura);
    }
}
createSakura();

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const switchBtn = document.getElementById('switch-btn');
const switchText = document.getElementById('switch-text');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

let isLoginMode = true;

// Switch between login and register
switchBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        switchText.textContent = "Don't have an account?";
        switchBtn.textContent = 'Register here';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        switchText.textContent = 'Already have an account?';
        switchBtn.textContent = 'Login here';
    }
    
    loginError.textContent = '';
    registerError.textContent = '';
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/';
        } else {
            loginError.textContent = data.error || 'Login failed';
        }
    } catch (error) {
        loginError.textContent = 'Connection error. Please try again.';
    }
});

// Register
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    registerError.textContent = '';
    
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/';
        } else {
            registerError.textContent = data.error || 'Registration failed';
        }
    } catch (error) {
        registerError.textContent = 'Connection error. Please try again.';
    }
});
