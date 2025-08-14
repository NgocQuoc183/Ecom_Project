// src/services/authService.js
const API_BASE = "http://localhost:5000/api/auth";

export const registerUser = async (form) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  return await res.json();
};

export const loginUser = async (form) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  return await res.json();
};
