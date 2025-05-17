import { useState } from 'react';

/**
 * Hook để hiển thị/ẩn mật khẩu
 * @returns {Object} { passwordVisibility, rightIcon, handlePasswordVisibility }
 */
const useTogglePasswordVisibility = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('👁️');

  const handlePasswordVisibility = () => {
    if (rightIcon === '👁️') {
      setRightIcon('👁️‍🗨️');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === '👁️‍🗨️') {
      setRightIcon('👁️');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  return {
    passwordVisibility,
    rightIcon,
    handlePasswordVisibility
  };
};

export default useTogglePasswordVisibility; 