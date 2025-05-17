import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ContactForm = ({ route }) => {
  const navigation = useNavigation();
  const isEdit = route.params?.contact ? true : false;
  const editContact = route.params?.contact;
  
  const [form, setForm] = useState({
    id: isEdit ? editContact.id : Date.now().toString(),
    name: isEdit ? editContact.name : '',
    phone: isEdit ? editContact.phone : '',
    email: isEdit ? editContact.email : '',
    avatar: isEdit ? editContact.avatar : 'https://randomuser.me/api/portraits/lego/1.jpg'
  });
  
  const [errors, setErrors] = useState({});
  
  // Xử lý thay đổi giá trị form
  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value
    });
    
    // Xóa lỗi khi người dùng chỉnh sửa
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  // Kiểm tra tính hợp lệ của form
  const validate = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Tên không được để trống';
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(form.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Xử lý lưu liên hệ
  const handleSave = () => {
    if (validate()) {
      // Thực hiện lưu liên hệ
      // Trong thực tế, đây là nơi để gọi API hoặc lưu vào state toàn cục
      
      Alert.alert(
        isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công',
        `Liên hệ "${form.name}" đã được ${isEdit ? 'cập nhật' : 'thêm'} thành công`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {isEdit ? 'Chỉnh sửa liên hệ' : 'Thêm liên hệ mới'}
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tên</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Nhập tên liên hệ"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="Nhập số điện thoại"
            value={form.phone}
            onChangeText={(text) => handleChange('phone', text)}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Nhập địa chỉ email"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
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
          >
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: '#4CAF50',
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
});

export default ContactForm; 