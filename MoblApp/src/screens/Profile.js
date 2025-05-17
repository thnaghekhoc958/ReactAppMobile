import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';

const Profile = () => {
  // Dữ liệu mẫu cho người dùng
  const user = {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0987654321',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    address: 'Hà Nội, Việt Nam',
    bio: 'Tôi là một nhà phát triển ứng dụng di động với kinh nghiệm 5 năm trong lĩnh vực React Native và Flutter.',
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Điện thoại</Text>
          <Text style={styles.infoValue}>{user.phone}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Địa chỉ</Text>
          <Text style={styles.infoValue}>{user.address}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  infoContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  infoItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile; 