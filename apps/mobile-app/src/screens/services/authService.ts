import apiClient from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface DriverSignupData extends UserSignupData {
  vehicleType: string;
  vehicleNumber: string;
  cnicImg?: string | null;
  licenseImg?: string | null;
  vehiclePapersImg?: string | null;
  profilePic?: string | null;
}


export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export const authService = {

  // User Signup API
  signupUser: async (userData: UserSignupData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/user', userData);
    return response.data;
  },

  // Driver Signup API
  signupDriver: async (userData: DriverSignupData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/driver', userData);
    return response.data;
  },



login: async (credentials: any) => {
    try {
      const response = await apiClient.post('/identity/login', credentials);
      const data = response.data ? response.data : response;

      if (data && data.accessToken) {
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
      }

      return data;
   } catch (error: any) {
  const status = error.response?.status; // e.g., 403, 401, etc.
  const errorData = error.response?.data;
  
  let errorMessage = 'Login failed';
  if (errorData) {
    if (typeof errorData === 'string') {
      errorMessage = errorData;
    } else if (errorData.message) {
      errorMessage = Array.isArray(errorData.message) 
        ? errorData.message[0] 
        : errorData.message;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  // Status code aur message dono aik object mein throw karein
  throw { status, message: errorMessage };
}
  },
};