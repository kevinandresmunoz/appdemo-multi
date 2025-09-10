// Script para generar pie de página dinámico
async function createFooter() {
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
                    <p><strong>${businessName}</strong></p>
                    <p>Sistema de gestión de productos y servicios</p>
                </div>
                
                <div class="footer-links">
                    <a href="index.html" style="color: white; margin: 0 1rem; text-decoration: none;">Productos</a>
                    <a href="servicios.html" style="color: white; margin: 0 1rem; text-decoration: none;">Servicios</a>
                    <a href="contacto.html" style="color: white; margin: 0 1rem; text-decoration: none;">Contacto</a>
                </div>
                
                <hr style="border: none; height: 1px; background-color: rgba(255, 255, 255, 0.2); margin: 1.5rem 0;">
                
                <div class="footer-copyright">
                    <p style="font-size: 0.8rem; opacity: 0.7;">&copy; ${new Date().getFullYear()} ${businessName}. Todos los derechos reservados.</p>
                </div>
            </div>
        `;
        
        console.log('Footer creado correctamente con estilos inline:', businessName);
        
        // Agregar el footer al final del body
        document.body.appendChild(footer);
        
    } catch (error) {
        console.error('Error al crear el pie de página:', error);
        // Crear footer con nombre por defecto si hay error
        createDefaultFooter();
    }
}

function createDefaultFooter() {
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
                <p><strong>Gestor de Productos</strong></p>
                <p>Sistema de gestión de productos y servicios</p>
            </div>
            
            <div class="footer-links">
                <a href="index.html" style="color: white; margin: 0 1rem; text-decoration: none;">Productos</a>
                <a href="servicios.html" style="color: white; margin: 0 1rem; text-decoration: none;">Servicios</a>
                <a href="contacto.html" style="color: white; margin: 0 1rem; text-decoration: none;">Contacto</a>
            </div>
            
            <hr style="border: none; height: 1px; background-color: rgba(255, 255, 255, 0.2); margin: 1.5rem 0;">
            
            <div class="footer-copyright">
                <p style="font-size: 0.8rem; opacity: 0.7;">&copy; ${new Date().getFullYear()} Gestor de Productos. Todos los derechos reservados.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(footer);
}

// Crear el footer cuando se carga la página
document.addEventListener('DOMContentLoaded', createFooter);