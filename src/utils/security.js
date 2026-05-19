// Sanitización de entradas para prevenir XSS 
export function sanitizeInput(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validación de formato de correo electrónico
export function validateEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

// Validación de fortaleza de contraseña: mínimo 8 caracteres, una mayúscula y un número
export function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push('Mínimo 8 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Al menos una letra mayúscula');
  if (!/[0-9]/.test(password)) errors.push('Al menos un número');
  return errors;
}

// Validación de nombre: solo letras y espacios, mínimo 2 caracteres
export function validateName(name) {
  const trimmed = name.trim();
  return trimmed.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(trimmed);
}

// Almacenamiento seguro de sesión usando sessionStorage (se limpia al cerrar el navegador)
// Migra datos residuales de localStorage inseguro al limpiar
export const authStorage = {
  setSession(token, user) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getToken() {
    return sessionStorage.getItem('token');
  },
  getUser() {
    try {
      return JSON.parse(sessionStorage.getItem('user'));
    } catch {
      return null;
    }
  },
  clear() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  isAuthenticated() {
    return !!sessionStorage.getItem('token');
  },
};
