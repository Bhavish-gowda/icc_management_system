// ── ICC Cricket Management System — auth.js ──

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('loginPassword');
  const signupPassword = document.getElementById('signupPassword');
  const strengthBar = document.getElementById('strengthBar');

  // ── Helper: Get Users ──
  const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

  // ── Helper: Save User ──
  const saveUser = (user) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  };

  // ── Toggle Password Visibility ──
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.classList.toggle('fa-eye');
      togglePassword.classList.toggle('fa-eye-slash');
    });
  }

  // ── Password Strength Indicator ──
  if (signupPassword && strengthBar) {
    signupPassword.addEventListener('input', () => {
      const val = signupPassword.value;
      strengthBar.className = 'strength-bar';
      if (val.length === 0) return;
      
      if (val.length < 6) {
        strengthBar.classList.add('strength-weak');
      } else if (val.length < 10) {
        strengthBar.classList.add('strength-medium');
      } else {
        strengthBar.classList.add('strength-strong');
      }
    });
  }

  // ── Handle Signup ──
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('signupBtn');
      const email = document.getElementById('signupEmail').value;
      const pass = document.getElementById('signupPassword').value;
      const confirmPass = document.getElementById('confirmPassword').value;

      // Duplicate check
      if (getUsers().find(u => u.email === email)) {
        showToast('Account already exists. Please login.', 'info');
        return;
      }

      // Confirm pass check
      if (pass !== confirmPass) {
        showToast('Passwords do not match!', 'info');
        return;
      }

      // Start loading
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';

      setTimeout(() => {
        const newUser = {
          fullName: document.getElementById('fullName').value,
          email: email,
          password: pass,
          role: document.getElementById('signupRole').value,
          country: document.getElementById('country').value,
          age: document.getElementById('age').value
        };

        saveUser(newUser);
        showToast('Registration successful! Redirecting...', 'success');
        
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      }, 1000);
    });
  }

  // ── Handle Login ──
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('loginBtn');
      const email = document.getElementById('loginEmail').value;
      const pass = document.getElementById('loginPassword').value;
      const role = document.getElementById('loginRole').value;

      // Start loading
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Validating...';

      setTimeout(() => {
        const user = getUsers().find(u => u.email === email && u.password === pass);

        if (user) {
          if (user.role !== role) {
            showToast(`Incorrect role selected for this account.`, 'info');
            btn.disabled = false;
            btn.innerHTML = 'Login to Dashboard';
            return;
          }

          // Success - Save Session
          localStorage.setItem('currentUser', JSON.stringify(user));
          showToast('Login successful! Welcome back.', 'success');

          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        } else {
          showToast('Invalid email or password.', 'info');
          btn.disabled = false;
          btn.innerHTML = 'Login to Dashboard';
        }
      }, 1200);
    });
  }
});
