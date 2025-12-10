import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CartScreen from '../screens/CartScreen';
import type { TabParamList } from '../types/navigation';
import ProductItem from '../screens/ShoppingScreen';
import { useProductStore } from '../stores/useProductStore';

const Tab = createBottomTabNavigator<TabParamList>();

export default function BottomTabNavigator() {
  const cartCount = useProductStore(state => state.getCartItemsCount());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#65558F',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen name="Shopping" component={ProductItem} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12 }}>Cart ({cartCount})</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
