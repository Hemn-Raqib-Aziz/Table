export function validateName(name) {
  if (!name || !name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (name.trim().length > 100) return 'Name must be less than 100 characters';
  return '';
}

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !email.trim()) return 'Email is required';
  if (!regex.test(email.trim())) return 'Invalid email format';
  return '';
}

export function validateAge(age) {
  if (!age || !age.toString().trim()) return 'Age is required';
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) return 'Age must be a number';
  if (ageNum < 1 || ageNum > 120) return 'Age must be between 1 and 120';
  return '';
}

export function validateCountry(country) {
  if (!country?.label) return 'Country is required';
  return '';
}

export function validateRole(role) {
  const validRoles = ['user', 'moderator', 'admin'];
  if (!role || !role.trim()) return 'Role is required';
  if (!validRoles.includes(role.trim().toLowerCase())) return 'Invalid role. Must be user, moderator, or admin';
  return '';
}