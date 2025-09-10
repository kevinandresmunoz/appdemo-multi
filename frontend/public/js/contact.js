// Cargar información de contacto desde Flask API
async function loadContactInfo() {
    try {
        const contactInfo = await apiRequest(API_CONFIG.endpoints.contact);
        displayContactInfo(contactInfo);
    } catch (error) {
        console.error('Error al cargar información de contacto:', error);
        showMessage('Error al cargar información de contacto: ' + error.message, 'error');
    }
}

// Mostrar información de contacto en la página
function displayContactInfo(info) {
    const contactInfoDiv = document.getElementById('contact-info');
    
    if (!info || Object.keys(info).length === 0) {
        contactInfoDiv.innerHTML = '<p>No hay información de contacto disponible</p>';
        return;
    }

    contactInfoDiv.innerHTML = `
        <div class="contact-container">
            <div class="contact-header">
                <h2>${info.business_name || 'Mi Negocio'}</h2>
                ${info.description ? `<p class="business-description">${info.description}</p>` : ''}
            </div>
            
            <div class="contact-details">
                <div class="contact-section">
                    <h3>Información de Contacto</h3>
                    <div class="contact-items">
                        ${info.address ? `
                            <div class="contact-item">
                                <strong>Dirección:</strong>
                                <span>${info.address}</span>
                            </div>
                        ` : ''}
                        
                        ${info.phone ? `
                            <div class="contact-item">
                                <strong>Teléfono:</strong>
                                <span><a href="tel:${info.phone}">${info.phone}</a></span>
                            </div>
                        ` : ''}
                        
                        ${info.email ? `
                            <div class="contact-item">
                                <strong>Email:</strong>
                                <span><a href="mailto:${info.email}">${info.email}</a></span>
                            </div>
                        ` : ''}
                        
                        ${info.whatsapp ? `
                            <div class="contact-item">
                                <strong>WhatsApp:</strong>
                                <span><a href="https://wa.me/${info.whatsapp}" target="_blank">${info.whatsapp}</a></span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                ${info.business_hours ? `
                    <div class="contact-section">
                        <h3>Horarios de Atención</h3>
                        <p>${info.business_hours}</p>
                    </div>
                ` : ''}

                ${(info.facebook || info.instagram) ? `
                    <div class="contact-section">
                        <h3>Redes Sociales</h3>
                        <div class="social-links">
                            ${info.facebook ? `
                                <a href="${info.facebook}" target="_blank" class="btn btn-secondary">Facebook</a>
                            ` : ''}
                            ${info.instagram ? `
                                <a href="${info.instagram}" target="_blank" class="btn btn-secondary">Instagram</a>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Cargar información de contacto cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    loadContactInfo();
});