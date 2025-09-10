// Script para cargar dinámicamente el nombre del negocio
async function loadBusinessName() {
    try {
        const contactInfo = await apiRequest('/api/contact');
        const businessName = contactInfo.business_name || 'Gestor de Productos';
        
        // Actualizar el logo en el header
        const logoElement = document.querySelector('.logo');
        if (logoElement) {
            logoElement.textContent = businessName;
        }
        
        // Actualizar el título de la página
        const currentTitle = document.title;
        if (currentTitle.includes('Gestor de Productos')) {
            document.title = currentTitle.replace('Gestor de Productos', businessName);
        } else if (currentTitle === 'Gestor de Productos') {
            document.title = businessName;
        }
        
    } catch (error) {
        console.error('Error al cargar el nombre del negocio:', error);
        // Mantener el nombre por defecto si hay error
    }
}

// Cargar el nombre del negocio cuando se carga la página
document.addEventListener('DOMContentLoaded', loadBusinessName);