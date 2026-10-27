const API_BASE = "/api";

let token = null;

export function setToken(value) {
  token = value;
}

export function getToken() {
  return token;
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData) && options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (options.raw) return res;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error?.message || "Yêu cầu thất bại");
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request("/auth/logout", { method: "POST", body: "{}" }),
  me: () => request("/auth/me"),
  requestTypes: () => request("/request-types"),
  agents: (departmentId) => request(`/departments/${departmentId}/agents`),
  listRequests: (params) => {
    const q = new URLSearchParams(params);
    return request(`/requests?${q.toString()}`);
  },
  createRequest: (body) => request("/requests", { method: "POST", body: JSON.stringify(body) }),
  getRequest: (id) => request(`/requests/${id}`),
  events: (id) => request(`/requests/${id}/events`),
  action: (id, action, body) =>
    request(`/requests/${id}/actions/${action}`, { method: "POST", body: JSON.stringify(body) }),
  comments: (id) => request(`/requests/${id}/comments`),
  addComment: (id, content) =>
    request(`/requests/${id}/comments`, { method: "POST", body: JSON.stringify({ content }) }),
  attachments: (id) => request(`/requests/${id}/attachments`),
  upload: (id, file) => {
    const form = new FormData();
    form.append("file", file);
    return request(`/requests/${id}/attachments`, { method: "POST", body: form });
  },
  dashboard: () => request("/dashboard"),
  downloadUrl: (attachmentId) => `${API_BASE}/attachments/${attachmentId}/download`,
};

export async function downloadFile(attachmentId, filename) {
  const res = await fetch(api.downloadUrl(attachmentId), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Không tải được tệp");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  a.click();
  URL.revokeObjectURL(url);
}
