// Importa createClient directamente desde el CDN (¡nuevo!)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Tus credenciales de Supabase
const SUPABASE_URL = 'https://cywsonaxzsfixwtdazgm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NvbmF4enNmaXh3dGRhemdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzE0MzksImV4cCI6MjA2NTUwNzQzOX0.yjYAW2Lvc_z3TdsGendoQXXu1Bj_3aZMGkJezCuY8Fo';

// ======================================
// Inicializa el cliente Supabase usando createClient
// ======================================
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ======================================
// TODO EL CÓDIGO RESTANTE DEBE IR DENTRO DE ESTE BLOQUE DOMContentLoaded
// ======================================
document.addEventListener('DOMContentLoaded', () => {

    // Referencias a los elementos del DOM
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const appMessageElement = document.getElementById('app-message'); // Para mensajes globales

    // Inputs y botones de los formularios
    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email'); // CAMBIADO ID
    const loginPasswordInput = document.getElementById('login-password');

    const registerForm = document.getElementById('register-form');
    const registerUsernameInput = document.getElementById('register-username');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const registerConfirmPasswordInput = document.getElementById('register-confirm-password');


    // Función para mostrar mensajes al usuario
    function showMessage(message, type = 'success') {
        appMessageElement.textContent = message;
        appMessageElement.style.color = type === 'success' ? 'green' : 'red';
        appMessageElement.style.display = 'block'; // Asegurarse de que el mensaje sea visible
        // Opcional: Ocultar el mensaje después de unos segundos
        setTimeout(() => {
            appMessageElement.style.display = 'none';
        }, 5000);
    }


    // ======================================
    // Lógica para mostrar/ocultar formularios
    // ======================================
    // Event listeners para cambiar entre formularios
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.classList.add('hidden');
        registerFormContainer.classList.remove('hidden');
        appMessageElement.style.display = 'none'; // Limpiar mensajes al cambiar
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormContainer.classList.add('hidden');
        loginFormContainer.classList.remove('hidden');
        appMessageElement.style.display = 'none'; // Limpiar mensajes al cambiar
    });

    // ======================================
    // MANEJO DEL REGISTRO DE USUARIOS con Supabase
    // ======================================
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = registerUsernameInput.value.trim();
        const email = registerEmailInput.value.trim();
        const password = registerPasswordInput.value.trim();
        const confirmPassword = registerConfirmPasswordInput.value.trim();

        if (password !== confirmPassword) {
            showMessage('Las contraseñas no coinciden.', 'error');
            return;
        }
        if (!username || !email || !password) {
            showMessage('Por favor, completa todos los campos.', 'error');
            return;
        }

        showMessage('Registrando usuario...', 'black'); // Mensaje de carga

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username
                    }
                }
            });

            if (error) {
                console.error('Error al registrar:', error);
                showMessage(`Error al registrar: ${error.message}`, 'error');
                return;
            }

            if (data.user) {
                showMessage(`¡Registro exitoso! Por favor, revisa tu email (${email}) para confirmar tu cuenta.`, 'success');
                setTimeout(() => {
                    showLoginLink.click();
                    registerForm.reset();
                }, 5000);
            } else {
                showMessage('Registro completado, pero se requiere verificación por email. Si ya tienes una cuenta, intenta iniciar sesión.', 'success');
                setTimeout(() => {
                    showLoginLink.click();
                    registerForm.reset();
                }, 5000);
            }

        } catch (err) {
            console.error('Error inesperado al registrar:', err);
            showMessage('Ocurrió un error inesperado durante el registro.', 'error');
        }
    });


    // ======================================
    // MANEJO DEL INICIO DE SESIÓN con Supabase
    // ======================================
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (!email || !password) {
            showMessage('Por favor, ingresa tu email y contraseña.', 'error');
            return;
        }

        showMessage('Iniciando sesión...', 'black'); // Mensaje de carga

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                console.error('Error al iniciar sesión:', error);
                if (error.message.includes('Invalid login credentials')) {
                    showMessage('Credenciales incorrectas. Verifica tu email y contraseña.', 'error');
                } else if (error.message.includes('Email not confirmed')) {
                     showMessage('Tu email no ha sido confirmado. Revisa tu bandeja de entrada o spam.', 'error');
                } else {
                    showMessage(`Error al iniciar sesión: ${error.message}`, 'error');
                }
                return;
            }

            if (data.user) {
                const username = data.user.user_metadata.username || data.user.email; 
                showMessage(`¡Inicio de sesión exitoso! Bienvenido, ${username}!`, 'success');
                console.log('Usuario logueado:', data.user);
                // window.location.href = 'dashboard.html'; 
                loginForm.reset();
            } else {
                showMessage('No se pudo iniciar sesión. Verifica tus credenciales.', 'error');
            }

        } catch (err) {
            console.error('Error inesperado al iniciar sesión:', err);
            showMessage('Ocurrió un error inesperado durante el inicio de sesión.', 'error');
        }
    });


    // ======================================
    // Manejo de "Olvidé mi contraseña"
    // ======================================
    document.getElementById('olvide-contraseña').addEventListener('click', async (e) => {
        e.preventDefault();
        const email = prompt("Por favor, ingresa tu email para restablecer la contraseña:");
        if (!email) {
            showMessage("Restablecimiento de contraseña cancelado.", "error");
            return;
        }
        
        showMessage("Enviando enlace de restablecimiento...", "black");
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/update-password.html'
            });
            if (error) {
                console.error("Error al enviar restablecimiento:", error);
                showMessage(`Error al enviar restablecimiento: ${error.message}`, "error");
            } else {
                showMessage("Se ha enviado un enlace para restablecer tu contraseña a tu email. Revisa tu bandeja de entrada y la carpeta de spam.", "success");
            }
        } catch (err) {
            console.error("Error inesperado al restablecer:", err);
            showMessage("Ocurrió un error inesperado al restablecer la contraseña.", "error");
        }
    });

    // Comprobar estado de autenticación al cargar la página
    (async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                console.log("Usuario ya autenticado:", user);
                const username = user.user_metadata.username || user.email;
                showMessage(`Bienvenido de nuevo, ${username}! Ya estás conectado.`, 'success');
            }
        } catch (error) {
            console.error("Error al obtener el estado de autenticación:", error);
        }
    })();
}); // Fin de DOMContentLoaded
