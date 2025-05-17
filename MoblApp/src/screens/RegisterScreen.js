import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTogglePasswordVisibility } from '../hooks/useTogglePasswordVisibility';
import { useAuth } from '../context/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Schema xác thực với Yup
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { passwordVisible, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility();
  const { register, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý lỗi
  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi đăng ký', error);
      clearError();
    }
  }, [error]);

  // Xử lý đăng ký
  const handleRegister = async (values) => {
    setIsLoading(true);
    
    try {
      await register(values.email, values.password);
      // Thông báo đăng ký thành công
      Alert.alert(
        'Đăng ký thành công',
        'Tài khoản của bạn đã được tạo thành công.',
        [{ 
          text: 'OK', 
          onPress: () => navigation.navigate('Login') 
        }]
      );
    } catch (error) {
      // Lỗi đã được xử lý trong AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.title}>Đăng ký</Text>
            <Text style={styles.subtitle}>Tạo tài khoản để sử dụng ứng dụng</Text>
          </View>
          
          <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <TextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={touched.email && errors.email}
                  left={<TextInput.Icon icon="email" />}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
                
                <TextInput
                  label="Mật khẩu"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  style={styles.input}
                  mode="outlined"
                  secureTextEntry={!passwordVisible}
                  error={touched.password && errors.password}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={rightIcon}
                      onPress={handlePasswordVisibility}
                    />
                  }
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                
                <TextInput
                  label="Xác nhận mật khẩu"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  style={styles.input}
                  mode="outlined"
                  secureTextEntry={!passwordVisible}
                  error={touched.confirmPassword && errors.confirmPassword}
                  left={<TextInput.Icon icon="lock-check" />}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
                
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    'Đăng ký'
                  )}
                </Button>
              </View>
            )}
          </Formik>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  errorText: {
    color: '#f44336',
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    padding: 4,
    marginTop: 16,
    backgroundColor: '#4CAF50',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#777',
  },
  footerLink: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 