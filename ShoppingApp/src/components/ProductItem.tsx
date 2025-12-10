import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Product } from '../types/product';
import { useProductStore } from '../stores/useProductStore';
import { images } from '../constants/images';

interface ProductItemProps {
  product: Product;
  onRemove?: () => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addToCartButton: {
    backgroundColor: '#5c4084',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#5c4084',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  deleteContainer: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#B3261E',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60%',
    width: '100%',
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default function ProductItem({ product, onRemove }: ProductItemProps) {
  const { addToCart, updateQuantity, getCartItem } = useProductStore();
  const cartItem = getCartItem(product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    const newQuantity = Math.max(0, quantity - 1);
    updateQuantity(product.id, newQuantity);
  };

  const renderRightActions = () => (
    <View style={styles.deleteContainer}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onRemove && onRemove()}
      >
        <Image source={images.trash_icon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      overshootFriction={8}
    >
      <View style={styles.container}>
        <Image source={images.productPlaceholder} style={styles.icon} />
        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price.toFixed(2)} / unit</Text>
        </View>

        {quantity === 0 ? (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.buttonText}>Add to cart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecrease}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrease}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Swipeable>
  );
}
