import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import AppRoute from './src/navigations/navigator';
import { store } from './src/redux/store';
import * as Font from 'expo-font';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import ToastManager from 'toastify-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  async function loadFonts() {
    try {
      await Font.loadAsync({
        'piedra-font': require('./assets/fonts/Piedra-Regular.ttf'),
      });
      setFontLoaded(true);
    } catch (error) {
      console.error('Error loading fonts:', error);
    }
  }
  useEffect(() => {
    loadFonts();
  }, []);
  if (!fontLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  console.log
  return (
    <SafeAreaProvider style={{ backgroundColor: '#31363C' }}>
      <Provider store={store}>
        <AppRoute />
        <StatusBar style="auto" />
        <ToastManager />
      </Provider>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#31363C',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
