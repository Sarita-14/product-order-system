
// API client: the ONLY place that talks to the NestJS backend.
// Backend response shapes we have to see src/common in the backend 
//   success -> { success: true,  statusCode, data, timestamp }
//   error   -> { success: false, statusCode, message, errors?, path, timestamp }
// request() unwraps `data` on success and throws ApiError on failure,
// so pages never deal with the wrapper.

// ---------- Config ----------
// "/api/v1" is proxied to the backend by vite.config.js (no CORS needed).
const BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

// ---------- Error type ----------
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// ---------- Core request ----------
async function request(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }

  if (response.status === 204) return null; // e.g. DELETE /products/:id

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    // Validation errors come as a list; show them all in one message
    const message = payload?.errors?.join(", ") ?? payload?.message;
    throw new ApiError(message ?? `Request failed (${response.status})`, response.status);
  }
  return payload.data;
}

// ---------- Resource factory ----------
// Every backend module exposes the same list/get/create routes,
// so they are built once here instead of being rewritten per module.
export function createResource(path) {
  return {
    list: () => request(path),
    get: (id) => request(`${path}/${id}`),
    create: (body) => request(path, { method: "POST", body }),
    update: (id, body) => request(`${path}/${id}`, { method: "PATCH", body }),
    remove: (id) => request(`${path}/${id}`, { method: "DELETE" }),
  };
}

