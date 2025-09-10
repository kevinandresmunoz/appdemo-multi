// Cargar servicios desde Flask API
async function loadServices() {
    try {
        const services = await apiRequest(API_CONFIG.endpoints.services);
        displayServices(services);
    } catch (error) {
        console.error('Error al cargar servicios:', error);
        showMessage('Error al cargar servicios: ' + error.message, 'error');
    }
}

// Mostrar servicios en la página
function displayServices(services) {
    const servicesGrid = document.getElementById('services-grid');
    
    if (!services || services.length === 0) {
        servicesGrid.innerHTML = '<p>No hay servicios disponibles</p>';
        return;
    }

    servicesGrid.innerHTML = services.map(service => `
        <div class="product-card">
            <img src="${service.image_url || 'https://via.placeholder.com/280x200?text=Servicio'}" 
                 alt="${service.name}" 
                 class="product-image">
            <div class="product-info">
                <h3 class="product-name">${service.name}</h3>
                <p class="product-description">${service.description || 'Sin descripción'}</p>
                <div class="product-price">$${formatPrice(service.price)}</div>
                ${service.duration ? `<p class="service-duration">Duración: ${service.duration}</p>` : ''}
            </div>
        </div>
    `).join('');
}

// Formatear precio
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Cargar servicios cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
});