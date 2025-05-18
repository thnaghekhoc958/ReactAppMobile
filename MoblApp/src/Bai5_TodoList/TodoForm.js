import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../context/AuthContext';
import { addTodo, getTodoById, updateTodo } from './todoService';
// Thêm import cho web
let ReactDatePicker;
if (Platform.OS === 'web') {
  ReactDatePicker = require('react-datepicker').default;
  require('react-datepicker/dist/react-datepicker.css');
}

const TodoForm = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const isEditMode = route.params?.todoId ? true : false;
  const todoId = route.params?.todoId;
  
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Lấy thông tin công việc nếu đang ở chế độ chỉnh sửa
  useEffect(() => {
    if (isEditMode) {
      const fetchTodoData = async () => {
        try {
          const todoData = await getTodoById(todoId);
          if (todoData) {
            setTitle(todoData.title);
            setDescription(todoData.description || '');
            setDueDate(todoData.dueDate ? todoData.dueDate.toDate() : null);
          } else {
            Alert.alert('Lỗi', 'Không tìm thấy công việc');
            navigation.goBack();
          }
        } catch (error) {
          console.error('Error fetching todo data: ', error);
          Alert.alert('Lỗi', 'Không thể tải thông tin công việc');
          navigation.goBack();
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTodoData();
    }
  }, [isEditMode, todoId]);
  
  // Xử lý hiển thị date picker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  
  // Xử lý thay đổi ngày
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };
  
  // Xóa ngày hết hạn
  const clearDueDate = () => {
    setDueDate(null);
  };
  
  // Kiểm tra dữ liệu trước khi lưu
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề công việc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Xử lý lưu công việc
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      if (isEditMode) {
        // Cập nhật công việc
        await updateTodo(todoId, {
          title,
          description: description.trim(),
          dueDate: dueDate ? new Date(dueDate) : null,
        });
        
        Alert.alert(
          'Thành công', 
          'Đã cập nhật công việc',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        // Thêm công việc mới
        await addTodo({
          title,
          description: description.trim(),
          dueDate: dueDate ? new Date(dueDate) : null,
          completed: false,
          userId: user.uid
        });
        
        Alert.alert(
          'Thành công', 
          'Đã thêm công việc mới',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error saving todo: ', error);
      Alert.alert('Lỗi', `Không thể ${isEditMode ? 'cập nhật' : 'thêm'} công việc`);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && isEditMode) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isEditMode ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiêu đề *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="Nhập tiêu đề công việc"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: null }));
                }
              }}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nhập mô tả công việc (tùy chọn)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngày hết hạn</Text>
            {Platform.OS === 'web' ? (
              <ReactDatePicker
                selected={dueDate}
                onChange={date => setDueDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày"
                customInput={<TextInput style={styles.dateButton} />}
                isClearable
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={showDatepicker}
                >
                  <Text style={styles.dateButtonText}>
                    {dueDate 
                      ? new Date(dueDate).toLocaleDateString('vi-VN') 
                      : 'Chọn ngày'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (date) setDueDate(date);
                    }}
                    minimumDate={new Date()}
                  />
                )}
              </>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Lưu</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
  },
  clearDateButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearDateText: {
    fontSize: 18,
    color: '#777',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TodoForm; 