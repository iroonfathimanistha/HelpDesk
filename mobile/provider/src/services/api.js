const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, { token, method = 'GET', body } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error(
      `Could not reach the server at ${API_BASE_URL}. Check that the backend is running and the API URL is reachable from this device.`
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`The server returned an invalid response (${response.status}).`);
  }

  if (!response.ok || payload.success === false) {
    throw new Error(
      payload.error?.message || `Request failed with status ${response.status}.`
    );
  }

  return payload.data || payload;
}

export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  return { token: data.token, user: data.user };
}

export async function getCurrentUser(token) {
  const data = await request('/auth/me', { token });
  return data.user;
}

export async function getAvailableRequests(token) {
  const data = await request('/service-requests/available?limit=100', { token });
  return data.serviceRequests || [];
}

export async function getServiceRequest(token, id) {
  const data = await request(`/service-requests/${encodeURIComponent(id)}`, {
    token,
  });
  return data.serviceRequest;
}

export async function acceptRequest(token, id) {
  const data = await request(
    `/service-requests/${encodeURIComponent(id)}/accept`,
    { token, method: 'PATCH' }
  );
  return data.serviceRequest;
}

export async function startRequest(token, id) {
  const data = await request(
    `/service-requests/${encodeURIComponent(id)}/start`,
    { token, method: 'PATCH' }
  );
  return data.serviceRequest;
}

export async function completeRequest(token, id) {
  const data = await request(
    `/service-requests/${encodeURIComponent(id)}/complete`,
    { token, method: 'PATCH' }
  );
  return data.serviceRequest;
}
