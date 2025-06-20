 const loginFormContainer = document.getElementById('login-form-container');
        const registerFormContainer = document.getElementById('register-form-container');
        const showRegisterLink = document.getElementById('show-register');
        const showLoginLink = document.getElementById('show-login');
//log in, el registro se elimina
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormContainer.classList.add('hidden');
            registerFormContainer.classList.remove('hidden');
        });
//register, el log in se elimina
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerFormContainer.classList.add('hidden');
            loginFormContainer.classList.remove('hidden');
        });

        // Optional: Add basic form submission handling (for demonstration)
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Intento de inicio de sesión (esto sería manejado por el backend)');
            // Here you would send data to your backend
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            alert('Intento de registro (esto sería manejado por el backend)');
            // Here you would send data to your backend
        });
