// URL de Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxSi7dEddZbgE4fLpSm_yQZDuSZ_ybaKLJOsrr8awQTJeH4KAvudkqAlB1UZdyOZPUh7g/exec';

// Función para mostrar/ocultar formularios
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

function showLoading() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Función para mostrar alertas
function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const form = document.querySelector('.form-container:not(.hidden)');
    if (form) {
        form.insertBefore(alertDiv, form.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 4000);
    }
}

// Manejar Login - ✅ CORREGIDO PARA VALIDAR CORRECTAMENTE
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validación básica
    if (!email || !password) {
        showAlert('Por favor completa todos los campos', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'login',
                email: email,
                password: password
            })
        });
        
        const result = await response.json();
        console.log('Respuesta del servidor:', result);
        
        hideLoading();
        
        // Verificar ESPECÍFICAMENTE que success sea true
        if (result.success === true) {
            // Login exitoso - credenciales correctas
            sessionStorage.setItem('userLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('userName', result.nombre || email);
            
            showAlert('¡Bienvenido!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            // Login fallido - credenciales incorrectas
            showLogin();
            showAlert(result.message || 'Email o contraseña incorrectos', 'error');
        }
        
    } catch (error) {
        hideLoading();
        showLogin();
        showAlert('Error al conectar con el servidor', 'error');
        console.error('Error:', error);
    }
}

// Manejar Registro - ✅ FUNCIONA CORRECTAMENTE
async function handleRegister(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const telefono = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    // Validaciones
    if (!nombre || !email || !telefono || !password) {
        showAlert('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'register',
                nombre: nombre,
                email: email,
                telefono: telefono,
                password: password
            })
        });
        
        const result = await response.json();
        
        hideLoading();
        
        if (result.success === true) {
            showLogin();
            showAlert('¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
            
            document.getElementById('registerName').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPhone').value = '';
            document.getElementById('registerPassword').value = '';
        } else {
            showRegister();
            showAlert(result.message || 'Error al registrarse', 'error');
        }
        
    } catch (error) {
        hideLoading();
        showRegister();
        showAlert('Error al conectar con el servidor', 'error');
        console.error('Error:', error);
    }
}

// Verificar sesión al cargar
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = sessionStorage.getItem('userLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = 'index.html';
    }
});