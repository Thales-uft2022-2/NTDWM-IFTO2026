import React from 'react';
import { StatusBar } from 'expo-status-bar';
import UsersScreen from './src/screens/UsersScreen';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <UsersScreen />
    </>
  );
}
