import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Load dữ liệu từ AsyncStorage khi component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Lưu dữ liệu vào AsyncStorage mỗi khi products thay đổi
  useEffect(() => {
    saveProducts();
  }, [products]);

  const loadProducts = async () => {
    try {
      const savedProducts = await AsyncStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm');
    }
  };

  const saveProducts = async () => {
    try {
      await AsyncStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu dữ liệu sản phẩm');
    }
  };

  const addProduct = () => {
    if (!name || !price) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (editingId !== null) {
      // Cập nhật sản phẩm
      setProducts(products.map(product => 
        product.id === editingId 
          ? { ...product, name, price: parseFloat(price) }
          : product
      ));
      setEditingId(null);
    } else {
      // Thêm sản phẩm mới
      setProducts([...products, {
        id: Date.now().toString(),
        name,
        price: parseFloat(price)
      }]);
    }
    setName('');
    setPrice('');
  };

  const deleteProduct = (id) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa sản phẩm này?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          onPress: () => setProducts(products.filter(product => product.id !== id)),
          style: 'destructive'
        }
      ]
    );
  };

  const editProduct = (product) => {
    setName(product.name);
    setPrice(product.price.toString());
    setEditingId(product.id);
  };

  const renderProduct = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.price.toLocaleString('vi-VN')} VNĐ</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => editProduct(item)}>Sửa</Button>
        <Button onPress={() => deleteProduct(item.id)}>Xóa</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Quản lý Sản phẩm" />
        </Appbar.Header>

        <View style={styles.inputContainer}>
          <TextInput
            label="Tên sản phẩm"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            label="Giá"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={addProduct} style={styles.button}>
            {editingId !== null ? 'Cập nhật' : 'Thêm sản phẩm'}
          </Button>
        </View>

        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
});

export default ProductList; 