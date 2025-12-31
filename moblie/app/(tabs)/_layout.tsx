import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: 'none' }, // 🔥 탭바 숨기기
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: '두 번째',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}