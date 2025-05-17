import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Dữ liệu mẫu cho danh bạ
const initialContacts = [
  { id: '1', name: 'Nguyễn Văn A', phone: '0987654321', email: 'nguyenvana@example.com', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Trần Thị B', phone: '0123456789', email: 'tranthib@example.com', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', name: 'Lê Văn C', phone: '0369852147', email: 'levanc@example.com', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: '4', name: 'Phạm Thị D', phone: '0974125836', email: 'phamthid@example.com', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', name: 'Hoàng Văn E', phone: '0912345678', email: 'hoangvane@example.com', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
];

const ContactList = () => {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState(initialContacts);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lọc danh bạ theo từ khóa tìm kiếm
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.phone.includes(searchQuery)
  );
  
  // Render mỗi item trong danh sách
  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('ContactDetail', { contact: item })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh bạ</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddContact')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm liên hệ..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#777',
  },
});

export default ContactList; 