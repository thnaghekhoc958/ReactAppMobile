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
import { useAuth } from '../context/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Schema xác thực với Yup
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
});

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { resetPassword, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý lỗi
  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', error);
      clearError();
    }
  }, [error]);

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async (values) => {
    setIsLoading(true);
    
    try {
      await resetPassword(values.email);
      Alert.alert(
        'Yêu cầu đặt lại mật khẩu đã được gửi',
        'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Login')
          }
        ]
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
            <Text style={styles.title}>Quên mật khẩu</Text>
            <Text style={styles.subtitle}>
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
            </Text>
          </View>
          
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleResetPassword}
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
                
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    'Gửi yêu cầu'
                  )}
                </Button>
              </View>
            )}
          </Formik>
          
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Quay lại đăng nhập</Text>
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
    alignItems: 'center',
  },
  footerLink: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen; 