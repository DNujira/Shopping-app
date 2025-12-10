import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../constants/images';

interface PlaceholderListProps {
  count?: number;
  title?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  titlePlaceholder: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  line: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  imageMargin: {
    marginRight: 10,
  },
});

export default function SkeletonLoad({ count = 10 }: PlaceholderListProps) {
  const renderPlaceholderItem = (index: number) => (
    <View key={index} style={styles.item}>
      <View style={styles.imageMargin}>
        <Image source={images.productPlaceholder} />
      </View>
      <View style={styles.textContainer}>
        <View style={[styles.line, { width: '60%' }]} />
        <View style={[styles.line, { width: '40%', marginTop: 10 }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {Array.from({ length: count }).map((_, i) => renderPlaceholderItem(i))}
    </SafeAreaView>
  );
}
