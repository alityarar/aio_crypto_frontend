// services/auth.js
import API_BASE_URL from '../constants/api';

export const login = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Giriş başarısız!');
  return res.json(); // içinde { token } dönecek
};
