const API = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location.origin.includes(":5173") ? "http://localhost:5000/api" : "/api");

export const api = async (path, options = {}) => {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(localStorage.token ? { Authorization: `Bearer ${localStorage.token}` } : {}),
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed.");
  }
  return response.status === 204 ? null : response.json();
};

export default api;
