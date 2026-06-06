const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3000";

// Token JWT armazenado em memória
let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  // Auth
  register: (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  // Categories
  listCategories: () => request("/categories"),
  createCategory: (data) =>
    request("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id, data) =>
    request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id) =>
    request(`/categories/${id}`, { method: "DELETE" }),

  // Transactions
  listTransactions: () => request("/transactions"),
  createTransaction: (data) =>
    request("/transactions", { method: "POST", body: JSON.stringify(data) }),
  updateTransaction: (id, data) =>
    request(`/transactions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTransaction: (id) =>
    request(`/transactions/${id}`, { method: "DELETE" }),
};