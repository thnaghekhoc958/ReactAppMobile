import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTodoById, deleteTodo, toggleTodoCompletion } from './todoService';

const TodoDetail = ({ route }) => {
  const { todoId } = route.params;
  const [todo, setTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  // Lấy thông tin chi tiết công việc
  useEffect(() => {
    const fetchTodoDetail = async () => {
      setIsLoading(true);
      try {
        const todoData = await getTodoById(todoId);
        if (todoData) {
          setTodo(todoData);
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy công việc');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching todo detail: ', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin công việc');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodoDetail();
  }, [todoId]);

  // Xử lý xóa công việc
  const handleDelete = () => {
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
              Alert.alert(
                'Thành công', 
                'Đã xóa công việc',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              console.error('Error deleting todo: ', error);
              Alert.alert('Lỗi', 'Không thể xóa công việc');
            }
          }
        }
      ]
    );
  };

  // Xử lý đánh dấu hoàn thành/chưa hoàn thành
  const handleToggleStatus = async () => {
    try {
      const newStatus = !todo.completed;
      await toggleTodoCompletion(todoId, newStatus);
      setTodo(prevTodo => ({
        ...prevTodo,
        completed: newStatus
      }));
      Alert.alert(
        'Thành công', 
        `Đã đánh dấu công việc là ${newStatus ? 'hoàn thành' : 'chưa hoàn thành'}`
      );
    } catch (error) {
      console.error('Error toggling todo status: ', error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái công việc');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!todo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin công việc</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{todo.title}</Text>
          <View style={[
            styles.statusBadge, 
            todo.completed ? styles.completedBadge : styles.activeBadge
          ]}>
            <Text style={styles.statusText}>
              {todo.completed ? 'Hoàn thành' : 'Đang thực hiện'}
            </Text>
          </View>
        </View>

        {todo.description ? (
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{todo.description}</Text>
          </View>
        ) : null}

        <View style={styles.metadataContainer}>
          {todo.dueDate ? (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Ngày hết hạn:</Text>
              <Text style={styles.metadataValue}>
                {new Date(todo.dueDate.toDate()).toLocaleDateString('vi-VN')}
              </Text>
            </View>
          ) : null}

          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>Ngày tạo:</Text>
            <Text style={styles.metadataValue}>
              {new Date(todo.createdAt.toDate()).toLocaleDateString('vi-VN')}
            </Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('EditTodo', { todoId })}
          >
            <Text style={styles.actionButtonText}>Sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, todo.completed ? styles.activeButton : styles.completeButton]}
            onPress={handleToggleStatus}
          >
            <Text style={styles.actionButtonText}>
              {todo.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.actionButtonText}>Xóa</Text>
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
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  completedBadge: {
    backgroundColor: '#27ae60',
  },
  activeBadge: {
    backgroundColor: '#3498db',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  metadataContainer: {
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metadataLabel: {
    fontWeight: 'bold',
    color: '#555',
    width: 120,
  },
  metadataValue: {
    flex: 1,
    color: '#333',
  },
  actionContainer: {
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  completeButton: {
    backgroundColor: '#27ae60',
  },
  activeButton: {
    backgroundColor: '#f39c12',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
});

export default TodoDetail; 