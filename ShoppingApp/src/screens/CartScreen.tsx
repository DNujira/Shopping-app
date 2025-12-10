import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useProductStore } from '../stores/useProductStore';
import { TabParamList } from '../types/navigation';
import ProductItem from '../components/ProductItem';
import { Snackbar } from 'react-native-paper';

type CartScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Cart'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  totalRow: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#65558F',
  },
  footer: {
    backgroundColor: '#E8DEF8',
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    color: '#333',
  },
  discountValue: {
    fontSize: 16,
    color: '#B3261E',
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  promotionBadge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  promotionText: {
    fontSize: 12,
    color: '#f57c00',
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#65558F',
    padding: 16,
    borderRadius: 100,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#baa7e8ff',
    opacity: 0.7,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 40,
    color: '#4F378A',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 28,
    color: '#000000',
    marginBottom: 20,
  },
  successText: {
    fontSize: 36,
    color: '#000000',
    marginBottom: 20,
  },
  thankyouText: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 20,
  },
  goShoppingButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#65558F',
    backgroundColor: '#65558F',
  },
  goShoppingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffffff',
  },
});

export default function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const {
    cart,
    updateQuantity,
    checkout,
    checkoutLoading,
    getCartPromotionDetails,
  } = useProductStore();
  const promotionDetails = getCartPromotionDetails();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    const result = await checkout();
    setIsProcessing(false);

    if (result.success) {
      setVisible(false);
      setCheckoutSuccess(true);
      return;
    } else {
      setVisible(true);
      console.log('error to checkout!!!');
    }
  };

  const renderCartItem = ({ item }: { item: (typeof cart)[0] }) => (
    <View style={styles.cartItem}>
      <ProductItem
        product={{
          id: item.id,
          name: item.name,
          price: item.price,
        }}
        onRemove={() => updateQuantity(item.id, 0)}
      />
    </View>
  );

  if (checkoutSuccess) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <Text style={styles.successText}>Success!</Text>
        <Text style={styles.thankyouText}>Thank you for shopping with us!</Text>

        <TouchableOpacity
          style={styles.goShoppingButton}
          onPress={() => {
            setCheckoutSuccess(false);
            navigation.navigate('Shopping');
          }}
        >
          <Text style={styles.goShoppingButtonText}>Go to shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Shopping')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.successContainer}>
          <Text style={styles.emptyText}>Empty Cart</Text>
          <TouchableOpacity
            style={styles.goShoppingButton}
            onPress={() => navigation.navigate('Shopping')}
          >
            <Text style={styles.goShoppingButtonText}>Go to shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.cartList}
          />
          <View style={styles.footer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>
                {promotionDetails.subtotal?.toFixed(2).toLocaleString()}
              </Text>
            </View>

            {promotionDetails.totalDiscount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Promotion discount</Text>
                <Text style={styles.discountValue}>
                  -{promotionDetails.totalDiscount?.toFixed(2).toLocaleString()}
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.priceText}>
                {promotionDetails.finalTotal.toLocaleString()}
              </Text>

              <TouchableOpacity
                style={[
                  styles.goShoppingButton,
                  (checkoutLoading || isProcessing) &&
                    styles.checkoutButtonDisabled,
                ]}
                onPress={handleCheckout}
                disabled={checkoutLoading || isProcessing}
              >
                {checkoutLoading || isProcessing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.checkoutButtonText}>Checkout</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={2000}
        style={{ backgroundColor: '#B3261E' }}
      >
        Something went wrong
      </Snackbar>
    </SafeAreaView>
  );
}
