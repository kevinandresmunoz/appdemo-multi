// Script para cargar dinámicamente el nombre del negocio en el dashboard admin
async function loadBusinessNameAdmin() {
    try {
        const contactInfo = await apiRequest('/api/contact');
        const businessName = contactInfo.business_name || 'Gestor de Productos';
        
        // Actualizar el logo en el header con " - Admin"
        const logoElement = document.querySelector('.logo');
        if (logoElement) {
            logoElement.textContent = `${businessName} - Admin`;
        }
        
        // Actualizar el título de la página
        const currentTitle = document.title;
        if (currentTitle.includes('Panel de Administración - Gestor de Productos')) {
            document.title = `Panel de Administración - ${businessName}`;
        } else if (currentTitle === 'Panel de Administración - Gestor de Productos') {
            document.title = `Panel de Administración - ${businessName}`;
        }
        
    } catch (error) {
        console.error('Error al cargar el nombre del negocio:', error);
        // Mantener el nombre por defecto si hay error
    }
}

// Cargar el nombre del negocio cuando se carga la página
document.addEventListener('DOMContentLoaded', loadBusinessNameAdmin);