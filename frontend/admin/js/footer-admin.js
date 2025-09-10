// Script para generar pie de página dinámico en área admin
async function createFooterAdmin() {
    try {
        // Obtener información del negocio
        const contactInfo = await apiRequest('/api/contact');
        const businessName = contactInfo.business_name || 'Gestor de Productos';
        
        // Crear el elemento footer
        const footer = document.createElement('footer');
        footer.className = 'footer';
        
        // Aplicar estilos inline como respaldo
        footer.style.backgroundColor = '#6c757d';
        footer.style.color = '#ffffff';
        footer.style.padding = '2rem 0 1rem';
        footer.style.marginTop = '4rem';
        footer.style.width = '100%';
        footer.style.textAlign = 'center';
        
        footer.innerHTML = `
            <div class="footer-content">
                <div class="footer-info">
                    <p><strong>${businessName} - Administración</strong></p>
                    <p>Panel de gestión administrativa</p>
                </div>
                
                <div class="footer-links">
                    <a href="dashboard.html" style="color: white; margin: 0 1rem; text-decoration: none;">Panel</a>
                    <a href="../public/index.html" style="color: white; margin: 0 1rem; text-decoration: none;">Ver Catálogo</a>
                </div>
                
                <hr style="border: none; height: 1px; background-color: rgba(255, 255, 255, 0.2); margin: 1.5rem 0;">
                
                <div class="footer-copyright">
                    <p style="font-size: 0.8rem; opacity: 0.7;">&copy; ${new Date().getFullYear()} ${businessName}. Panel de administración.</p>
                </div>
            </div>
        `;
        
        // Agregar el footer al final del body
        document.body.appendChild(footer);
        
    } catch (error) {
        console.error('Error al crear el pie de página:', error);
        // Crear footer con nombre por defecto si hay error
        createDefaultFooterAdmin();
    }
}

function createDefaultFooterAdmin() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    
    // Aplicar estilos inline como respaldo
    footer.style.backgroundColor = '#6c757d';
    footer.style.color = '#ffffff';
    footer.style.padding = '2rem 0 1rem';
    footer.style.marginTop = '4rem';
    footer.style.width = '100%';
    footer.style.textAlign = 'center';
    
    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-info">
                <p><strong>Gestor de Productos - Administración</strong></p>
                <p>Panel de gestión administrativa</p>
            </div>
            
            <div class="footer-links">
                <a href="dashboard.html" style="color: white; margin: 0 1rem; text-decoration: none;">Panel</a>
                <a href="../public/index.html" style="color: white; margin: 0 1rem; text-decoration: none;">Ver Catálogo</a>
            </div>
            
            <hr style="border: none; height: 1px; background-color: rgba(255, 255, 255, 0.2); margin: 1.5rem 0;">
            
            <div class="footer-copyright">
                <p style="font-size: 0.8rem; opacity: 0.7;">&copy; ${new Date().getFullYear()} Gestor de Productos. Panel de administración.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(footer);
}

// Crear el footer cuando se carga la página
document.addEventListener('DOMContentLoaded', createFooterAdmin);