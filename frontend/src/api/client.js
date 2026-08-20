const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = (configuredApiUrl || (import.meta.env.DEV ? 'http://localhost:8800' : '')).replace(/\/+$/, '');

async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  if (!API_URL) {
    throw new Error('The app is not configured. Set VITE_API_URL in the Vercel environment variables and redeploy.');
  }
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: 'Bearer ' + token } : {}),
      ...headers,
    },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error('Unable to reach the API. Please try again shortly.');
  }
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Normalize error shapes from the server so the UI can display readable messages.
    // If the server returns a structured error (object/array), stringify it for display.
    let errMsg = 'Request failed';
    if (data) {
      if (typeof data.error === 'string') {
        errMsg = data.error;
      } else if (data.error) {
        try {
          errMsg = JSON.stringify(data.error, null, 2);
        } catch {
          errMsg = String(data.error);
        }
      } else if (typeof data.msg === 'string') {
        errMsg = data.msg;
      } else {
        try {
          errMsg = JSON.stringify(data);
        } catch {
          errMsg = String(data);
        }
      }
    }

    throw new Error(errMsg || 'Request failed');
  }

  return data;
}

export const api = { request };

