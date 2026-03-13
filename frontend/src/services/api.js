const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

let accessToken = null;
let refreshPromise = null;

export function setApiAccessToken(token) {
  accessToken = token;
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data?.data?.accessToken) {
          throw new Error(data?.message || 'Unable to refresh token');
        }
        accessToken = data.data.accessToken;
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    retry = true
  } = options;

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  if (body instanceof FormData) {
    delete requestHeaders['Content-Type'];
  }

  if (auth && accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
    credentials: 'include'
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && auth && retry) {
    try {
      await refreshAccessToken();
      return request(path, { ...options, retry: false });
    } catch (_err) {
      accessToken = null;
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with ${response.status}`);
    error.status = response.status;
    error.details = data?.details;
    throw error;
  }

  return { data };
}

export const api = {
  get(path, options = {}) {
    return request(path, { ...options, method: 'GET' });
  },
  post(path, body, options = {}) {
    return request(path, { ...options, method: 'POST', body });
  },
  put(path, body, options = {}) {
    return request(path, { ...options, method: 'PUT', body });
  },
  patch(path, body, options = {}) {
    return request(path, { ...options, method: 'PATCH', body });
  },
  delete(path, options = {}) {
    return request(path, { ...options, method: 'DELETE' });
  }
};
