import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';

// Import các component từ các bài tập
import ProductList from './src/Bai1_GiaoDienCoBan/ProductList';
import Calculator from './src/Bai2_MayTinh/Calculator';
import ContactList from './src/Bai3_DanhBa/ContactList';
import LoginScreen from './src/Bai4_Authentication/LoginScreen';
import RegisterScreen from './src/Bai4_Authentication/RegisterScreen';
import ForgotPasswordScreen from './src/Bai4_Authentication/ForgotPasswordScreen';
import TodoList from './src/Bai5_TodoList/TodoList';
import TodoForm from './src/Bai5_TodoList/TodoForm';

const Stack = createStackNavigator();

const App = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  const renderContent = () => {
    switch (selectedExercise) {
      case 'products':
        return <ProductList />;
      case 'calculator':
        return <Calculator />;
      case 'contacts':
        return <ContactList />;
      case 'auth':
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Stack.Navigator>
        );
      case 'todo':
        return (
          <Stack.Navigator>
            <Stack.Screen 
              name="TodoList" 
              component={TodoList}
              options={{ title: 'Danh sách công việc' }}
            />
            <Stack.Screen 
              name="TodoForm" 
              component={TodoForm}
              options={({ route }) => ({ 
                title: route.params?.todo ? 'Sửa công việc' : 'Thêm công việc' 
              })}
            />
          </Stack.Navigator>
        );
      default:
        return (
          <ScrollView contentContainerStyle={styles.menuContainer}>
            <Text style={styles.title}>Các bài thực hành React Native</Text>
            
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setSelectedExercise('products')}
            >
              <Text style={styles.menuButtonText}>Bài 1: Quản lý Sản phẩm</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setSelectedExercise('calculator')}
            >
              <Text style={styles.menuButtonText}>Bài 2: Máy tính bỏ túi</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setSelectedExercise('contacts')}
            >
              <Text style={styles.menuButtonText}>Bài 3: Ứng dụng danh bạ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setSelectedExercise('auth')}
            >
              <Text style={styles.menuButtonText}>Bài 4: Đăng nhập/Đăng ký</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setSelectedExercise('todo')}
            >
              <Text style={styles.menuButtonText}>Bài 5: Todo List với Firebase</Text>
            </TouchableOpacity>
          </ScrollView>
        );
    }
  };

  return (
    <AuthProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          <View style={styles.container}>
            {selectedExercise && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setSelectedExercise(null)}
              >
                <Text style={styles.backButtonText}>← Quay lại</Text>
              </TouchableOpacity>
            )}
            {renderContent()}
          </View>
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  menuContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
  },
});

export default App; 