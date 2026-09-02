import { getSecureItem } from '../utils/storage';
import { Platform } from 'react-native';

export const API_BASE_URL = Platform.OS === 'web' 
  ? "http://localhost:5000" 
  : "http://192.168.1.96:5000";

export const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    import('react-native').then(({ DeviceEventEmitter }) => {
      DeviceEventEmitter.emit('onSessionExpired');
    });
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
  }
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Server error occurred');
  }
  
  return data;
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getSecureItem('auth_token');
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const isFormData = options.body instanceof FormData;
  
  if (isFormData) {
    delete defaultHeaders['Content-Type'];
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleApiResponse(response);
  } catch (error: any) {
    // Network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection to the server.');
    }
    throw error;
  }
};



