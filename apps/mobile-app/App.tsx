import React from 'react';
import Toast from 'react-native-toast-message';
import { RegisterScreen } from './src/screens/auth/registrationScreen';

export default function App() {
  return (
    <>
      <RegisterScreen />
      
      {/* Toast component yahan bottom par lazmi hona chahiye */}
      <Toast />
    </>
  );
}