import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  getAllTodos, 
  toggleTodoCompletion, 
  deleteTodo 
} from './todoService';
import { useAuth } from '../context/AuthContext';

const TodoList = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const navigation = useNavigation();

  // Lấy danh sách công việc khi component được mount
  useEffect(() => {
    if (user && user.uid) {
      loadTodos();
    }
  }, [user]);

  // Lọc công việc khi filter hoặc searchQuery thay đổi
  useEffect(() => {
    filterTodos();
  }, [todos, filter, searchQuery]);

  // Hàm lấy danh sách công việc từ Firestore
  const loadTodos = async () => {
    setIsLoading(true);
    try {
      const todoData = await getAllTodos(user.uid);
      setTodos(todoData);
    } catch (error) {
      console.error('Error loading todos: ', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách công việc');
    } finally {
      setIsLoading(false);
    }
  };

  // Lọc công việc theo trạng thái và từ khóa tìm kiếm
  const filterTodos = () => {
    let result = [...todos];
    
    // Lọc theo trạng thái
    if (filter === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      result = result.filter(todo => todo.completed);
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      result = result.filter(todo => 
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredTodos(result);
  };

  // Đánh dấu hoàn thành/chưa hoàn thành công việc
  const handleToggleCompletion = async (todoId, isCompleted) => {
    try {
      await toggleTodoCompletion(todoId, !isCompleted);
      
      // Cập nhật state
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === todoId ? { ...todo, completed: !isCompleted } : todo
        )
      );
    } catch (error) {
      console.error('Error toggling todo: ', error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái công việc');
    }
  };

  // Xóa công việc
  const handleDelete = (todoId) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa công việc này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTodo(todoId);
              
              // Cập nhật state
              setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
            } catch (error) {
              console.error('Error deleting todo: ', error);
              Alert.alert('Lỗi', 'Không thể xóa công việc');
            }
          }
        }
      ]
    );
  };

  // Render mỗi item trong danh sách
  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity 
        style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        onPress={() => handleToggleCompletion(item.id, item.completed)}
      >
        {item.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.todoTextContainer}
        onPress={() => navigation.navigate('TodoDetail', { todoId: item.id })}
      >
        <Text 
          style={[
            styles.todoTitle, 
            item.completed && styles.todoTitleCompleted
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        {item.description ? (
          <Text style={styles.todoDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  // Render khi không có công việc nào
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <Text style={styles.emptyText}>
          {filter === 'all' 
            ? 'Chưa có công việc nào. Hãy thêm công việc mới!' 
            : filter === 'active' 
              ? 'Không có công việc đang thực hiện.'
              : 'Không có công việc đã hoàn thành.'}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Danh sách công việc</Text>
          {user && (
            <Text style={styles.userName}>Xin chào, {user.displayName || user.email}</Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('TodoForm')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm công việc..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'active' && styles.activeFilter]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.activeFilterText]}>
            Đang thực hiện
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
            Hoàn thành
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredTodos}
        renderItem={renderTodoItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={filteredTodos.length === 0 ? { flex: 1 } : null}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    color: '#555',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3498db',
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  activeFilter: {
    backgroundColor: '#3498db',
  },
  filterText: {
    color: '#555',
  },
  activeFilterText: {
    color: 'white',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3498db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3498db',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  todoDescription: {
    fontSize: 14,
    color: '#777',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#e74c3c',
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TodoList; 