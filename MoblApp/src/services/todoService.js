import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  serverTimestamp, 
  orderBy 
} from 'firebase/firestore';
import { firestore } from '../config/firebase';

const todosRef = collection(firestore, 'todos');

// Lấy danh sách todo của một user
export const getTodosByUser = async (userId) => {
  try {
    const q = query(
      todosRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const todos = [];
    
    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return todos;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách todo:', error);
    throw error;
  }
};

// Lấy chi tiết một todo
export const getTodoById = async (todoId) => {
  try {
    const todoDoc = doc(firestore, 'todos', todoId);
    const todoSnapshot = await getDoc(todoDoc);
    
    if (todoSnapshot.exists()) {
      return {
        id: todoSnapshot.id,
        ...todoSnapshot.data()
      };
    } else {
      throw new Error('Không tìm thấy todo!');
    }
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết todo:', error);
    throw error;
  }
};

// Thêm mới một todo
export const addTodo = async (todoData) => {
  try {
    const newTodo = {
      ...todoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completed: false
    };
    
    const docRef = await addDoc(todosRef, newTodo);
    return {
      id: docRef.id,
      ...newTodo
    };
  } catch (error) {
    console.error('Lỗi khi thêm todo:', error);
    throw error;
  }
};

// Cập nhật một todo
export const updateTodo = async (todoId, todoData) => {
  try {
    const todoDoc = doc(firestore, 'todos', todoId);
    const updatedData = {
      ...todoData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(todoDoc, updatedData);
    return {
      id: todoId,
      ...updatedData
    };
  } catch (error) {
    console.error('Lỗi khi cập nhật todo:', error);
    throw error;
  }
};

// Xóa một todo
export const deleteTodo = async (todoId) => {
  try {
    const todoDoc = doc(firestore, 'todos', todoId);
    await deleteDoc(todoDoc);
    return todoId;
  } catch (error) {
    console.error('Lỗi khi xóa todo:', error);
    throw error;
  }
};

// Đánh dấu hoàn thành/chưa hoàn thành một todo
export const toggleTodoComplete = async (todoId, isCompleted) => {
  try {
    const todoDoc = doc(firestore, 'todos', todoId);
    await updateDoc(todoDoc, {
      completed: !isCompleted,
      updatedAt: serverTimestamp()
    });
    
    return {
      id: todoId,
      completed: !isCompleted
    };
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái todo:', error);
    throw error;
  }
}; 