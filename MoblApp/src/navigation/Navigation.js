import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

// Import screens
import Calculator from '../screens/Calculator';
import ContactList from '../screens/ContactList';
import ContactDetail from '../screens/ContactDetail';
import ContactForm from '../screens/ContactForm';
import Profile from '../screens/Profile';
import TodoList from '../screens/TodoList';
import TodoDetail from '../screens/TodoDetail';
import TodoForm from '../screens/TodoForm';
import HomeScreen from '../screens/HomeScreen';

// Khởi tạo các navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Stack Navigator cho phần Contact
const ContactStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ContactList" 
        component={ContactList} 
        options={{ title: 'Danh bạ' }}
      />
      <Stack.Screen 
        name="ContactDetail" 
        component={ContactDetail} 
        options={{ title: 'Chi tiết liên hệ' }}
      />
      <Stack.Screen 
        name="AddContact" 
        component={ContactForm} 
        options={{ title: 'Thêm liên hệ' }}
      />
      <Stack.Screen 
        name="EditContact" 
        component={ContactForm} 
        options={{ title: 'Chỉnh sửa liên hệ' }}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator cho phần Todo
const TodoStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="TodoList" 
        component={TodoList} 
        options={{ title: 'Danh sách công việc' }}
      />
      <Stack.Screen 
        name="TodoDetail" 
        component={TodoDetail} 
        options={{ title: 'Chi tiết công việc' }}
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
};

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Contacts') {
            iconName = focused ? 'contacts' : 'contacts-outline';
          } else if (route.name === 'Calculator') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === 'Todos') {
            iconName = focused ? 'checkbox-marked-outline' : 'checkbox-blank-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Todos" 
        component={TodoStackNavigator} 
        options={{ 
          headerShown: false,
          title: 'Công việc'
        }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactStackNavigator} 
        options={{ 
          headerShown: false,
          title: 'Danh bạ'
        }}
      />
      <Tab.Screen 
        name="Calculator" 
        component={Calculator}
        options={{ 
          title: 'Máy tính',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ 
          title: 'Hồ sơ',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: '#4CAF50',
        drawerInactiveTintColor: 'gray',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={TabNavigator} 
        options={{ 
          headerShown: false,
          title: 'Trang chủ',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="UserHome" 
        component={HomeScreen} 
        options={{ 
          title: 'Thông tin tài khoản',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ 
          title: 'Thông tin',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="information-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Màn hình About đơn giản
const AboutScreen = () => {
  return (
    <Text style={{ 
      flex: 1, 
      textAlign: 'center', 
      justifyContent: 'center', 
      padding: 20, 
      fontSize: 16 
    }}>
      Ứng dụng Quản lý công việc - Phiên bản 1.0
    </Text>
  );
};

// Root Navigator
const Navigation = () => {
  return <DrawerNavigator />;
};

export default Navigation; 