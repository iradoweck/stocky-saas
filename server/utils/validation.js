export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSKU(sku) {
  return sku.length > 0 && sku.length <= 50;
}

export function validateBarcode(barcode) {
  return barcode.length > 0 && barcode.length <= 50;
}

export function validatePositiveNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

export function validateNonNegativeNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

export function validateObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
