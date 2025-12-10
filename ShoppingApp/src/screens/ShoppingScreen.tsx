import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductItem from '../components/ProductItem';
import { useProductStore } from '../stores/useProductStore';
import images from '../constants/images';
import SkeletonLoad from './skeletonLoad';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  recommendSection: {
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recommendListContainer: {
    paddingBottom: 8,
  },
  recommendItem: {
    width: 280,
    marginHorizontal: 4,
  },
  listContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyRecommendContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  refreshButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#65558F',
    backgroundColor: '#65558F',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function ShoppingScreen() {
  const {
    products,
    recommendedProducts,
    loading,
    recommendLoading,
    error,
    fetchProducts,
    loadMoreProducts,
    hasMore,
    nextCursor,
    setProducts,
    fetchRecommendProduct,
  } = useProductStore();

  useEffect(() => {
    fetchProducts(20);
    fetchRecommendProduct();
  }, [fetchProducts, fetchRecommendProduct]);

  const handleRemoveProduct = (productId: number) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && nextCursor) {
      loadMoreProducts();
    }
  };

  const renderFooter = () => {
    if (!loading || products.length === 0) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#65558F" />
        <Text style={styles.footerText}>Loading..</Text>
      </View>
    );
  };

  const handleRefreshRecommended = () => {
    fetchRecommendProduct();
  };

  const renderRecommendedSection = () => (
    <View>
      <Text style={styles.sectionTitle}>Recommended Products</Text>
      {recommendLoading ? (
        //
        <SkeletonLoad />
      ) : recommendedProducts?.length > 0 ? (
        <View style={styles.recommendListContainer}>
          {recommendedProducts.slice(0, 4).map(item => (
            <ProductItem
              key={`rec-${item.id}`}
              product={item}
              onRemove={() => {}}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyRecommendContainer}>
          <Image source={images.error_icon} />
          <Text style={styles.emptyText}>Something went wrong</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefreshRecommended}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.sectionTitle}>Latest Products</Text>
    </View>
  );

  if (
    (loading && products?.length === 0) ||
    (recommendLoading && recommendedProducts?.length === 0)
  ) {
    return <SkeletonLoad />;
  }

  if (error && products?.length === 0 && recommendedProducts?.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>เกิดข้อผิดพลาด: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => `product-${item.id}`}
        ListHeaderComponent={renderRecommendedSection}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            onRemove={() => handleRemoveProduct(item.id)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>ไม่มีสินค้า</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
