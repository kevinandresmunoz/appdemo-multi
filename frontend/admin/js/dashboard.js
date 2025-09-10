let editingProductId = null;
let editingServiceId = null;
let selectedProductId = null;
let selectedServiceId = null;

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await apiRequest(API_CONFIG.endpoints.auth.check);
        
        if (!response.authenticated) {
            window.location.href = 'login.html';
            return;
        }

        // Inicializar dashboard
        initializeDashboard();
    } catch (error) {
        window.location.href = 'login.html';
    }
});

// Inicializar el dashboard
function initializeDashboard() {
    // Configurar tabs
    setupTabs();
    
    // Cargar datos iniciales
    loadAdminProducts();
    loadAdminServices();
    loadContactInfo();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar previews de imágenes
    setupImagePreviews();
}

// Configurar sistema de tabs
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Limpiar selecciones al cambiar de tab
            clearProductSelection();
            clearServiceSelection();
            
            // Actualizar botones activos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Actualizar contenido activo
            tabContents.forEach(content => content.classList.remove('active'));
            const targetTab = document.getElementById(`${tabName}-tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await apiRequest(API_CONFIG.endpoints.auth.logout, { method: 'POST' });
                window.location.href = '../public/index.html';
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                window.location.href = '../public/index.html';
            }
        });
    }

    // PRODUCTOS
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            showProductForm();
        });
    }
    
    const productCancelBtn = document.getElementById('product-cancel-btn');
    if (productCancelBtn) {
        productCancelBtn.addEventListener('click', () => {
            hideProductForm();
        });
    }
    
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
    
    // Botones de editar y eliminar producto
    const editProductBtn = document.getElementById('edit-product-btn');
    if (editProductBtn) {
        editProductBtn.addEventListener('click', () => {
            if (selectedProductId) {
                editProduct(selectedProductId);
            }
        });
    }
    
    const deleteProductBtn = document.getElementById('delete-product-btn');
    if (deleteProductBtn) {
        deleteProductBtn.addEventListener('click', () => {
            if (selectedProductId) {
                deleteProduct(selectedProductId);
            }
        });
    }

    // SERVICIOS
    const addServiceBtn = document.getElementById('add-service-btn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', () => {
            showServiceForm();
        });
    }
    
    const serviceCancelBtn = document.getElementById('service-cancel-btn');
    if (serviceCancelBtn) {
        serviceCancelBtn.addEventListener('click', () => {
            hideServiceForm();
        });
    }
    
    const serviceForm = document.getElementById('service-form');
    if (serviceForm) {
        serviceForm.addEventListener('submit', handleServiceSubmit);
    }
    
    // Botones de editar y eliminar servicio
    const editServiceBtn = document.getElementById('edit-service-btn');
    if (editServiceBtn) {
        editServiceBtn.addEventListener('click', () => {
            if (selectedServiceId) {
                editService(selectedServiceId);
            }
        });
    }
    
    const deleteServiceBtn = document.getElementById('delete-service-btn');
    if (deleteServiceBtn) {
        deleteServiceBtn.addEventListener('click', () => {
            if (selectedServiceId) {
                deleteService(selectedServiceId);
            }
        });
    }

    // CONTACTO
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// ========= CONFIGURACIÓN DE PREVIEWS =========

function setupImagePreviews() {
    // Preview para productos
    const productImageInput = document.getElementById('product-image');
    if (productImageInput) {
        productImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById('product-image-preview');
            const previewImg = document.getElementById('product-preview-img');
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
            }
        });
    }
    
    // Preview para servicios
    const serviceImageInput = document.getElementById('service-image');
    if (serviceImageInput) {
        serviceImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById('service-image-preview');
            const previewImg = document.getElementById('service-preview-img');
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
            }
        });
    }
}

// ========= PRODUCTOS =========

async function loadAdminProducts() {
    try {
        const products = await apiRequest(API_CONFIG.endpoints.products);
        displayAdminProducts(products);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showMessage('Error al cargar productos: ' + error.message, 'error');
    }
}

function displayAdminProducts(products) {
    const productsGrid = document.getElementById('admin-products-grid');
    
    if (!products || products.length === 0) {
        productsGrid.innerHTML = '<p>No hay productos disponibles</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="selectProduct(${product.id})" data-product-id="${product.id}">
            <img src="${product.image_url || 'https://picsum.photos/280/200?random=' + product.id}" 
                 alt="${product.name}" 
                 class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description || 'Sin descripción'}</p>
                <div class="product-price">$${formatPrice(product.price)}</div>
                <p class="product-stock">Stock: ${product.stock}</p>
            </div>
        </div>
    `).join('');
}

function showProductForm(product = null) {
    const container = document.getElementById('product-form-container');
    const title = document.getElementById('product-form-title');
    const preview = document.getElementById('product-image-preview');
    const previewImg = document.getElementById('product-preview-img');
    
    if (product) {
        title.textContent = 'Editar Producto';
        editingProductId = product.id;
        
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        
        // Mostrar imagen existente si existe
        if (product.image_url) {
            previewImg.src = product.image_url;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    } else {
        title.textContent = 'Agregar Producto';
        editingProductId = null;
        document.getElementById('product-form').reset();
        preview.style.display = 'none';
    }
    
    container.style.display = 'block';
}

function hideProductForm() {
    document.getElementById('product-form-container').style.display = 'none';
    document.getElementById('product-form').reset();
    document.getElementById('product-image-preview').style.display = 'none';
    editingProductId = null;
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        image_url: null
    };

    try {

        // Manejar imagen si se selecciona una nueva
                const imageInput = document.getElementById("product-image");
                if (imageInput.files && imageInput.files[0]) {
                    showMessage("Subiendo imagen...", "info");
                    const uploadResult = await uploadImage(imageInput.files[0], 'product');
                    formData.image_url = uploadResult.image_url;
                }
        
        if (editingProductId) {
            await apiRequest(`${API_CONFIG.endpoints.products}/${editingProductId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            showMessage('Producto actualizado', 'success');
        } else {
            await apiRequest(API_CONFIG.endpoints.products, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showMessage('Producto creado', 'success');
        }

        hideProductForm();
        clearProductSelection();
        loadAdminProducts();
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al guardar producto: ' + error.message, 'error');
    }
}

async function editProduct(id) {
    try {
        const product = await apiRequest(`${API_CONFIG.endpoints.products}/${id}`);
        showProductForm(product);
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al cargar producto: ' + error.message, 'error');
    }
}

async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }

    try {
        await apiRequest(`${API_CONFIG.endpoints.products}/${id}`, {
            method: 'DELETE'
        });

        showMessage('Producto eliminado', 'success');
        clearProductSelection();
        loadAdminProducts();
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al eliminar producto: ' + error.message, 'error');
    }
}

// ========= SERVICIOS =========

async function loadAdminServices() {
    try {
        const services = await apiRequest(API_CONFIG.endpoints.services);
        displayAdminServices(services);
    } catch (error) {
        console.error('Error al cargar servicios:', error);
        showMessage('Error al cargar servicios: ' + error.message, 'error');
    }
}

function displayAdminServices(services) {
    const servicesGrid = document.getElementById('admin-services-grid');
    
    if (!services || services.length === 0) {
        servicesGrid.innerHTML = '<p>No hay servicios disponibles</p>';
        return;
    }

    servicesGrid.innerHTML = services.map(service => `
        <div class="product-card" onclick="selectService(${service.id})" data-service-id="${service.id}">
            <img src="${service.image_url || 'https://picsum.photos/280/200?random=service' + service.id}" 
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

function showServiceForm(service = null) {
    const container = document.getElementById('service-form-container');
    const title = document.getElementById('service-form-title');
    const preview = document.getElementById('service-image-preview');
    const previewImg = document.getElementById('service-preview-img');
    
    if (service) {
        title.textContent = 'Editar Servicio';
        editingServiceId = service.id;
        
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-description').value = service.description || '';
        document.getElementById('service-price').value = service.price;
        document.getElementById('service-duration').value = service.duration || '';
        
        // Mostrar imagen existente si existe
        if (service.image_url) {
            previewImg.src = service.image_url;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    } else {
        title.textContent = 'Agregar Servicio';
        editingServiceId = null;
        document.getElementById('service-form').reset();
        preview.style.display = 'none';
    }
    
    container.style.display = 'block';
}

function hideServiceForm() {
    document.getElementById('service-form-container').style.display = 'none';
    document.getElementById('service-form').reset();
    document.getElementById('service-image-preview').style.display = 'none';
    editingServiceId = null;
}

async function handleServiceSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('service-name').value,
        description: document.getElementById('service-description').value,
        price: parseFloat(document.getElementById('service-price').value),
        duration: document.getElementById('service-duration').value || null,
        image_url: null,
        is_active: true
    };

    try {

        // Manejar imagen si se selecciona una nueva
                const imageInput = document.getElementById("service-image");
                if (imageInput.files && imageInput.files[0]) {
                    showMessage("Subiendo imagen...", "info");
                    const uploadResult = await uploadImage(imageInput.files[0], 'service');
                    formData.image_url = uploadResult.image_url;
                }
        
        if (editingServiceId) {
            await apiRequest(`${API_CONFIG.endpoints.services}/${editingServiceId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            showMessage('Servicio actualizado', 'success');
        } else {
            await apiRequest(API_CONFIG.endpoints.services, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showMessage('Servicio creado', 'success');
        }

        hideServiceForm();
        clearServiceSelection();
        loadAdminServices();
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al guardar servicio: ' + error.message, 'error');
    }
}

async function editService(id) {
    try {
        const service = await apiRequest(`${API_CONFIG.endpoints.services}/${id}`);
        showServiceForm(service);
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al cargar servicio: ' + error.message, 'error');
    }
}

async function deleteService(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
        return;
    }

    try {
        await apiRequest(`${API_CONFIG.endpoints.services}/${id}`, {
            method: 'DELETE'
        });

        showMessage('Servicio eliminado', 'success');
        clearServiceSelection();
        loadAdminServices();
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al eliminar servicio: ' + error.message, 'error');
    }
}

// ========= SELECCIÓN DE PRODUCTOS Y SERVICIOS =========

function selectProduct(productId) {
    // Remover selección anterior
    document.querySelectorAll('#admin-products-grid .product-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Seleccionar el producto actual
    const selectedCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedProductId = productId;
        
        // Mostrar botones de acción
        document.getElementById('edit-product-btn').style.display = 'inline-block';
        document.getElementById('delete-product-btn').style.display = 'inline-block';
    }
}

function selectService(serviceId) {
    // Remover selección anterior
    document.querySelectorAll('#admin-services-grid .product-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Seleccionar el servicio actual
    const selectedCard = document.querySelector(`[data-service-id="${serviceId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedServiceId = serviceId;
        
        // Mostrar botones de acción
        document.getElementById('edit-service-btn').style.display = 'inline-block';
        document.getElementById('delete-service-btn').style.display = 'inline-block';
    }
}

function clearProductSelection() {
    selectedProductId = null;
    document.querySelectorAll('#admin-products-grid .product-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById('edit-product-btn').style.display = 'none';
    document.getElementById('delete-product-btn').style.display = 'none';
}

function clearServiceSelection() {
    selectedServiceId = null;
    document.querySelectorAll('#admin-services-grid .product-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById('edit-service-btn').style.display = 'none';
    document.getElementById('delete-service-btn').style.display = 'none';
}

// ========= CONTACTO =========

async function loadContactInfo() {
    try {
        const contactInfo = await apiRequest(API_CONFIG.endpoints.contact);
        
        // Llenar formulario con datos existentes
        document.getElementById('business-name').value = contactInfo.business_name || '';
        document.getElementById('business-email').value = contactInfo.email || '';
        document.getElementById('business-phone').value = contactInfo.phone || '';
        document.getElementById('business-whatsapp').value = contactInfo.whatsapp || '';
        document.getElementById('business-address').value = contactInfo.address || '';
        document.getElementById('business-description').value = contactInfo.description || '';
        document.getElementById('business-hours').value = contactInfo.business_hours || '';
        document.getElementById('business-facebook').value = contactInfo.facebook || '';
        document.getElementById('business-instagram').value = contactInfo.instagram || '';
        
    } catch (error) {
        console.error('Error al cargar información de contacto:', error);
        showMessage('Error al cargar información de contacto: ' + error.message, 'error');
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = {
        business_name: document.getElementById('business-name').value,
        email: document.getElementById('business-email').value,
        phone: document.getElementById('business-phone').value,
        whatsapp: document.getElementById('business-whatsapp').value,
        address: document.getElementById('business-address').value,
        description: document.getElementById('business-description').value,
        business_hours: document.getElementById('business-hours').value,
        facebook: document.getElementById('business-facebook').value,
        instagram: document.getElementById('business-instagram').value
    };

    try {
        await apiRequest(API_CONFIG.endpoints.contact, {
            method: 'PUT',
            body: JSON.stringify(formData)
        });

        showMessage('Información de contacto actualizada', 'success');
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al guardar información: ' + error.message, 'error');
    }
}

// ========= UTILIDADES =========

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}