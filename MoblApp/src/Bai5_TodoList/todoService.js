import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp, 
  orderBy 
} from 'firebase/firestore';
import { firestore } from '../config/firebase';

const TODOS_COLLECTION = 'todos';

/**
 * Thêm một công việc mới vào Firestore
 * @param {Object} todoData - Dữ liệu công việc bao gồm title, description, dueDate, userId
 * @returns {Promise<Object>} Dữ liệu công việc đã được thêm vào, bao gồm cả id
 */
export const addTodo = async (todoData) => {
  try {
    const todoRef = collection(firestore, TODOS_COLLECTION);
    const docRef = await addDoc(todoRef, {
      ...todoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...todoData
    };
  } catch (error) {
    console.error('Error adding todo: ', error);
    throw error;
  }
};

/**
 * Lấy thông tin của một công việc theo id
 * @param {string} todoId - Id của công việc
 * @returns {Promise<Object|null>} Dữ liệu công việc hoặc null nếu không tìm thấy
 */
export const getTodoById = async (todoId) => {
  try {
    const todoDoc = await getDoc(doc(firestore, TODOS_COLLECTION, todoId));
    
    if (!todoDoc.exists()) {
      return null;
    }
    
    return {
      id: todoDoc.id,
      ...todoDoc.data()
    };
  } catch (error) {
    console.error('Error getting todo: ', error);
    throw error;
  }
};

/**
 * Lấy tất cả công việc của người dùng
 * @param {string} userId - Id của người dùng
 * @returns {Promise<Array>} Mảng các công việc
 */
export const getAllTodos = async (userId) => {
  try {
    const todosQuery = query(
      collection(firestore, TODOS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(todosQuery);
    const todos = [];
    
    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return todos;
  } catch (error) {
    console.error('Error getting todos: ', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin công việc
 * @param {string} todoId - Id của công việc
 * @param {Object} updateData - Dữ liệu cần cập nhật
 * @returns {Promise<void>}
 */
export const updateTodo = async (todoId, updateData) => {
  try {
    const todoRef = doc(firestore, TODOS_COLLECTION, todoId);
    
    await updateDoc(todoRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating todo: ', error);
    throw error;
  }
};

/**
 * Xóa một công việc
 * @param {string} todoId - Id của công việc
 * @returns {Promise<void>}
 */
export const deleteTodo = async (todoId) => {
  try {
    const todoRef = doc(firestore, TODOS_COLLECTION, todoId);
    await deleteDoc(todoRef);
  } catch (error) {
    console.error('Error deleting todo: ', error);
    throw error;
  }
};

/**
 * Đánh dấu công việc là hoàn thành hoặc chưa hoàn thành
 * @param {string} todoId - Id của công việc
 * @param {boolean} completed - Trạng thái hoàn thành
 * @returns {Promise<void>}
 */
export const toggleTodoCompletion = async (todoId, completed) => {
  try {
    const todoRef = doc(firestore, TODOS_COLLECTION, todoId);
    
    await updateDoc(todoRef, {
      completed,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling todo completion: ', error);
    throw error;
  }
}; 