import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Tạo context
export const AuthContext = createContext({});

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theo dõi trạng thái xác thực
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup function
    return unsubscribe;
  }, []);

  // Xử lý lỗi từ Firebase
  const handleFirebaseError = (error) => {
    let errorMessage = '';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email này đã được sử dụng.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email không hợp lệ.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Không tìm thấy tài khoản với email này.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Mật khẩu không chính xác.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự.';
        break;
      default:
        errorMessage = error.message;
        break;
    }

    setError(errorMessage);
    return errorMessage;
  };

  // Đăng ký
  const register = async (email, password) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      return handleFirebaseError(error);
    }
  };

  // Đăng nhập
  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      return handleFirebaseError(error);
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      return handleFirebaseError(error);
    }
  };

  // Đặt lại mật khẩu
  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      return handleFirebaseError(error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        resetPassword,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
}; 