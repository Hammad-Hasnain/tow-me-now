import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Apni backend API ka base URL yahan dein
const apiClient = axios.create({
  baseURL: 'http://192.168.100.68:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 1. Request Interceptor (Token attach karne ke liye)
apiClient.interceptors.request.use(
  async (config) => {
    // Yahan AsyncStorage se token nikal kar header mein add kar sakte hain
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor (Success aur Errors handle karne ke liye)
apiClient.interceptors.response.use(
  (response) => {
    // Backend se aane wale successful response ko directly return karein ya data extract karein
    return response.data;
  },
(error) => {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      
      const errorData = error.response.data;
      let errorMessage = 'Something went wrong on the server.';
      
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData?.message) {
        errorMessage = Array.isArray(errorData.message) 
          ? errorData.message[0] 
          : errorData.message;
      }

      // Status code aur message dono aik object ki shakal mein reject karein
      return Promise.reject({
        status: error.response.status,
        message: errorMessage,
      });
    } else if (error.request) {
      console.error('Network Error:', error.request);
      return Promise.reject({
        status: null,
        message: 'Network error! Please check if your backend server is running.',
      });
    } else {
      console.error('Error Message:', error.message);
      return Promise.reject({
        status: null,
        message: error.message,
      });
    }
  }
);

export default apiClient;