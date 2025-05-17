import { useState } from 'react';

export const useTogglePasswordVisibility = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rightIcon, setRightIcon] = useState('eye-off');

  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisible(false);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisible(true);
    }
  };

  return {
    passwordVisible,
    rightIcon,
    handlePasswordVisibility
  };
}; 