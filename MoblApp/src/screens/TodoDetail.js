import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { getTodoById, toggleTodoComplete, deleteTodo } from '../services/todoService';

const TodoDetail = ({ route }) => {
  const { todoId } = route.params;
  const navigation = useNavigation();
  
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy chi tiết todo
  useEffect(() => {
    fetchTodoDetail();
  }, [todoId]);

  const fetchTodoDetail = async () => {
    try {
      setLoading(true);
      const todoData = await getTodoById(todoId);
      setTodo(todoData);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải chi tiết công việc');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái hoàn thành
  const handleToggleComplete = async () => {
    try {
      await toggleTodoComplete(todoId, todo.completed);
      setTodo({ ...todo, completed: !todo.completed });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái công việc');
    }
  };

  // Xóa todo
  const handleDeleteTodo = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa "${todo.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          onPress: async () => {
            try {
              await deleteTodo(todoId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa công việc');
            }
          }, 
          style: 'destructive' 
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{todo.title}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Trạng thái:</Text>
            <View style={[
              styles.statusBadge,
              todo.completed ? styles.completedBadge : styles.pendingBadge
            ]}>
              <Text style={styles.statusText}>
                {todo.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Mô tả</Text>
        <Text style={styles.description}>
          {todo.description || 'Không có mô tả'}
        </Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.toggleButton]}
          onPress={handleToggleComplete}
        >
          <MaterialCommunityIcons
            name={todo.completed ? 'undo' : 'check'}
            size={20}
            color="white"
          />
          <Text style={styles.actionButtonText}>
            {todo.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('TodoForm', { todo })}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="white" />
          <Text style={styles.actionButtonText}>Chỉnh sửa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteTodo}
        >
          <MaterialCommunityIcons name="delete" size={20} color="white" />
          <Text style={styles.actionButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
      
      {todo.createdAt && (
        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>
            Tạo: {todo.createdAt.toDate().toLocaleString()}
          </Text>
          {todo.updatedAt && (
            <Text style={styles.timeText}>
              Cập nhật: {todo.updatedAt.toDate().toLocaleString()}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
  },
  pendingBadge: {
    backgroundColor: '#FFC107',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionsContainer: {
    margin: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  timeInfo: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  timeText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
});

export default TodoDetail; 