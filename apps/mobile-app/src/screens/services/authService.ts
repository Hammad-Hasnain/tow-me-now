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
      // Backend se aane wala exact message nikalna (e.g., 403 Forbidden under review message)
      const errorData = error.response?.data;
      
      let errorMessage = 'Login failed';
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          // Agar message array ya string ki shakal mein ho
          errorMessage = Array.isArray(errorData.message) 
            ? errorData.message[0] 
            : errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw errorMessage; // Yeh exact message catch block mein string ban kar jayega
    }
  },
};