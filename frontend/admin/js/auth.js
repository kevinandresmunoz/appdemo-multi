// Manejar login a través de Flask API
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await apiRequest(API_CONFIG.endpoints.auth.login, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        showMessage('Sesión iniciada correctamente', 'success');
        
        // Redireccionar al dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al iniciar sesión: ' + error.message, 'error');
    }
});

// Verificar si ya hay una sesión activa
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await apiRequest(API_CONFIG.endpoints.auth.check);
        
        if (response.authenticated) {
            // Ya hay sesión activa, redireccionar al dashboard
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        // No hay sesión activa, permanecer en login
        console.log('No hay sesión activa');
    }
});