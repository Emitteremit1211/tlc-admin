// Central place for the API base URL and token helpers, so nothing else
// has to know the storage details.

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getToken() {
    return localStorage.getItem("tlc_admin_token");
}

export function setToken(token) {
    localStorage.setItem("tlc_admin_token", token);
}

export function clearToken() {
    localStorage.removeItem("tlc_admin_token");
}

export function isLoggedIn() {
    return Boolean(getToken());
}