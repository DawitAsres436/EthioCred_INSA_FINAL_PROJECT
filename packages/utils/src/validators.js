export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
  if (typeof password !== 'string') return false;
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function isValidFaydaId(id) {
  return typeof id === 'string' && id.trim().length > 0 && id.startsWith('FAYDA-');
}

export function isValidGpa(gpa) {
  const value = parseFloat(gpa);
  return !Number.isNaN(value) && value >= 0 && value <= 4;
}
