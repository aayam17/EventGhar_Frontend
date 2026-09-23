export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const api = (path = "") =>
  `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

export function userHeaders(json = true) {
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("eventghar_token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function adminHeaders(json = true) {
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("eventghar_admin_token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
