import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { addTodo, updateTodo } from '../services/todoService';

// Schema xác thực
const TodoSchema = Yup.object().shape({
  title: Yup.string()
    .required('Tiêu đề là bắt buộc')
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
  description: Yup.string(),
});

const TodoForm = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Kiểm tra xem đang thêm mới hay chỉnh sửa
  const isEdit = route.params?.todo ? true : false;
  const existingTodo = route.params?.todo || null;
  
  // Xử lý submit form
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      if (isEdit) {
        // Cập nhật todo
        await updateTodo(existingTodo.id, {
          title: values.title,
          description: values.description,
        });
        
        Alert.alert(
          'Thành công',
          'Công việc đã được cập nhật',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        // Thêm mới todo
        await addTodo({
          title: values.title,
          description: values.description,
          userId: user.uid
        });
        
        Alert.alert(
          'Thành công',
          'Đã thêm công việc mới',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Lỗi',
        `Không thể ${isEdit ? 'cập nhật' : 'thêm mới'} công việc`
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEdit ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
          </Text>
        </View>
        
        <Formik
          initialValues={{
            title: isEdit ? existingTodo.title : '',
            description: isEdit ? existingTodo.description || '' : '',
          }}
          validationSchema={TodoSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tiêu đề</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.title && errors.title && styles.inputError
                  ]}
                  placeholder="Nhập tiêu đề công việc"
                  value={values.title}
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                />
                {touched.title && errors.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mô tả (tùy chọn)</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Nhập mô tả chi tiết về công việc"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => navigation.goBack()}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {isEdit ? 'Cập nhật' : 'Thêm mới'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    marginTop: 4,
    fontSize: 14,
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    marginLeft: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});

export default TodoForm; 