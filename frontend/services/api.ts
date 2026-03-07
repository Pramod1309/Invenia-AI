import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

export const apiClient = {
  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async put(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async delete(endpoint: string) {
    try {
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log('🗑️ API Client: Starting DELETE request to:', fullUrl);
      console.log('🌐 API_BASE_URL:', API_BASE_URL);
      console.log('📍 Endpoint:', endpoint);
      
      const response = await fetch(fullUrl, {
        method: 'DELETE',
      });
      
      console.log('📡 API Client: DELETE response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        console.error('❌ API Client: DELETE request failed:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      console.log('✅ API Client: DELETE request successful:', responseData);
      return responseData;
    } catch (error) {
      console.error('❌ API Client: DELETE request error:', error);
      throw error;
    }
  },
};

export const api = {
  test: () => apiClient.get(API_ENDPOINTS.ROOT),
  users: {
    getAll: () => apiClient.get(API_ENDPOINTS.USERS),
    create: (userData: { name: string; email: string; password: string }) => 
      apiClient.post(API_ENDPOINTS.USERS, userData),
    login: (userData: { email: string; password: string }) => 
      apiClient.post(`${API_ENDPOINTS.USERS}/login`, userData),
  },
  jobs: {
    getAll: () => apiClient.get(API_ENDPOINTS.JOBS),
    getById: (id: string) => apiClient.get(`${API_ENDPOINTS.JOBS}/${id}`),
    create: (jobData: any) => apiClient.post(API_ENDPOINTS.JOBS, jobData),
    update: (id: string, jobData: any) => apiClient.put(`${API_ENDPOINTS.JOBS}/${id}`, jobData),
    delete: (id: string) => apiClient.delete(`${API_ENDPOINTS.JOBS}/${id}`),
    getStats: () => apiClient.get(`${API_ENDPOINTS.JOBS}/stats`),
    getByStatus: (status: string) => apiClient.get(`${API_ENDPOINTS.JOBS}/filter?status=${status}`),
  },
};
