import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { FAB } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import {
  getTodosByUser,
  addTodo,
  toggleTodoComplete,
  deleteTodo
} from '../services/todoService';

const TodoList = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useAuth();
  
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState('');
  const [addingTodo, setAddingTodo] = useState(false);

  // Lấy danh sách todo khi màn hình được focus
  useEffect(() => {
    if (isFocused && user) {
      fetchTodos();
    }
  }, [isFocused, user]);

  // Fetch todos từ Firestore
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const todoList = await getTodosByUser(user.uid);
      setTodos(todoList);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách công việc');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm todo mới
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      setAddingTodo(true);
      
      const todoData = {
        title: newTodo.trim(),
        description: '',
        userId: user.uid,
      };
      
      await addTodo(todoData);
      setNewTodo('');
      fetchTodos();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm công việc mới');
      console.error(error);
    } finally {
      setAddingTodo(false);
    }
  };

  // Đánh dấu hoàn thành/chưa hoàn thành
  const handleToggleTodo = async (id, isCompleted) => {
    try {
      await toggleTodoComplete(id, isCompleted);
      
      // Cập nhật trạng thái local
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái công việc');
      console.error(error);
    }
  };

  // Xóa todo
  const handleDeleteTodo = (id, title) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa "${title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          onPress: async () => {
            try {
              await deleteTodo(id);
              setTodos(todos.filter(todo => todo.id !== id));
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa công việc');
              console.error(error);
            }
          }, 
          style: 'destructive' 
        },
      ]
    );
  };

  // Chuyển đến màn hình chi tiết
  const navigateToDetail = (todo) => {
    navigation.navigate('TodoDetail', { todoId: todo.id });
  };

  // Render mỗi item trong danh sách
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => navigateToDetail(item)}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          item.completed && styles.checkboxChecked
        ]}
        onPress={() => handleToggleTodo(item.id, item.completed)}
      >
        {item.completed && (
          <MaterialCommunityIcons name="check" color="white" size={16} />
        )}
      </TouchableOpacity>
      
      <View style={styles.todoContent}>
        <Text
          style={[
            styles.todoTitle,
            item.completed && styles.completedText
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        {item.description ? (
          <Text 
            style={styles.todoDescription} 
            numberOfLines={1}
          >
            {item.description}
          </Text>
        ) : null}
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTodo(item.id, item.title)}
      >
        <MaterialCommunityIcons name="delete-outline" color="#f44336" size={24} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render khi không có todo
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={64}
        color="#cccccc"
      />
      <Text style={styles.emptyText}>
        Chưa có công việc nào. Hãy thêm mới!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách công việc</Text>
        <Text style={styles.welcomeText}>
          Xin chào, {user?.email?.split('@')[0]}
        </Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Thêm công việc mới..."
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={handleAddTodo}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTodo}
          disabled={addingTodo || !newTodo.trim()}
        >
          {addingTodo ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialCommunityIcons name="plus" color="white" size={24} />
          )}
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={todos.length === 0 ? { flex: 1 } : null}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('TodoForm')}
        color="white"
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  todoDescription: {
    fontSize: 14,
    color: '#666',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
  },
});

export default TodoList; 