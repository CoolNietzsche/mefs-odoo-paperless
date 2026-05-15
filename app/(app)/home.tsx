import React, { useRef } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import OdooWebView, { OdooWebViewRef } from '../../src/components/OdooWebView';
import NativeHeader from '../../src/components/NativeHeader';
import { useAuthStore } from '../../src/store/auth.store';
import { colors } from '../../src/theme/colors';

export default function HomeScreen() {
  const { session, logout } = useAuthStore();
  const webViewRef = useRef<OdooWebViewRef>(null);

  if (!session) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <NativeHeader 
          title="Odoo Workplace" 
          onLeftPress={() => webViewRef.current?.goBack()}
          showBack={true}
        />
        <OdooWebView 
          ref={webViewRef}
          url={session.server_url} 
          onSessionExpired={() => {
            logout();
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  }
});
