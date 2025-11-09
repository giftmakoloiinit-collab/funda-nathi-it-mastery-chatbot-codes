
import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import Logo from './Logo';
import { IUser } from '../types';

interface LoginProps {
  onLogin: (user: IUser) => void;
}

// Self-contained JWT decoder to replace the external library
const decodeJwt = (token: string): { name: string, picture: string } | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};


const Login: React.FC<LoginProps> = ({ onLogin }) => {

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = decodeJwt(credentialResponse.credential);
      if (decoded) {
          onLogin({
            name: decoded.name,
            picture: decoded.picture
          });
      } else {
        handleError();
      }
    }
  };

  const handleError = () => {
    console.error('Login Failed or JWT could not be decoded.');
    // You could add a user-facing error message here
  };

  return (
    <div className="bg-[#FFEB70] h-screen flex flex-col justify-center items-center p-6 text-center text-[#333333]">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full flex flex-col items-center">
        <Logo className="w-28 h-28 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Welcome to Funda Nathi</h1>
        <p className="text-lg text-gray-600 mb-8">Your personal IT Mastery Chatbot.</p>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
        />
      </div>
      <p className="text-xs text-gray-500 mt-6">
        Aweh, Hola, Howzit — Welcome Home to Easy IT Learning.
      </p>
    </div>
  );
};

export default Login;
