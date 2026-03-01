const BASE_URL = '/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
      console.error('API Error Response:', errorData);
    } catch (e) {
      errorData = { message: 'Bir sunucu hatası oluştu.' };
      console.error('API Error (Could not parse JSON):', response.status, response.statusText);
    }

    const error = new Error(errorData.message || 'Bir hata oluştu.');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  async get(endpoint, options = {}) {
    console.log(`GET ${endpoint}`);
    const token = getAuthToken();
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        method: 'GET',
        headers,
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Fetch GET ${endpoint} failed:`, error);
      throw error;
    }
  },

  async post(endpoint, data, options = {}) {
    console.log(`POST ${endpoint}`, data instanceof FormData ? 'FormData' : data);
    const token = getAuthToken();
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let body;
    if (data instanceof FormData) {
      body = data;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        method: 'POST',
        headers,
        body,
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Fetch POST ${endpoint} failed:`, error);
      throw error;
    }
  },

  async patch(endpoint, data, options = {}) {
    console.log(`PATCH ${endpoint}`, data);
    const token = getAuthToken();
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Fetch PATCH ${endpoint} failed:`, error);
      throw error;
    }
  },

  async delete(endpoint, options = {}) {
    console.log(`DELETE ${endpoint}`);
    const token = getAuthToken();
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        method: 'DELETE',
        headers,
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Fetch DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }
};
