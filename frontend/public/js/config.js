// Configuración del API (solo Flask backend)
const API_CONFIG = {
    baseUrl: 'http://localhost:5000', // URL del backend Flask
    endpoints: {
        // Productos
        products: '/api/products',
        // Servicios
        services: '/api/services',
        // Contacto
        contact: '/api/contact',
        // Autenticación
        auth: {
            login: '/api/auth/login',
            logout: '/api/auth/logout',
            check: '/api/auth/check'
        },
        // Categorías
        categories: '/api/categories',
        // Imágenes
        uploadImage: '/api/upload-image',
        deleteImage: '/api/delete-image'
    }
};

// Función para hacer peticiones HTTP con manejo de errores
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_CONFIG.baseUrl}${endpoint}`;
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Incluir cookies de sesión
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        const response = await fetch(url, mergedOptions);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en petición API:', error);
        throw error;
    }
}

// Función para mostrar mensajes
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Función para subir imágenes
async function uploadImage(file, type = 'product') {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.uploadImage}`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error al subir imagen:', error);
        throw error;
    }
}
