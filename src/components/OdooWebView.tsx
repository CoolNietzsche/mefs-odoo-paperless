import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { 
  View, 
  ActivityIndicator, 
  StyleSheet, 
  Platform, 
  Alert,
  BackHandler,
  RefreshControl,
  ScrollView
} from 'react-native';
import { colors } from '../theme/colors';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { useAuthStore } from '../store/auth.store';
import { useAppStore } from '../store/app.store';

interface OdooWebViewProps {
  url: string;
  onNavigate?: (url: string) => void;
  onSessionExpired?: () => void;
}

export interface OdooWebViewRef {
  reload: () => void;
  goBack: () => void;
  injectJavaScript: (script: string) => void;
}

const OdooWebView = forwardRef<OdooWebViewRef, OdooWebViewProps>(({ url, onNavigate, onSessionExpired }, ref) => {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { session, logout } = useAuthStore();

  useImperativeHandle(ref, () => ({
    reload: () => webViewRef.current?.reload(),
    goBack: () => webViewRef.current?.goBack(),
    injectJavaScript: (script) => webViewRef.current?.injectJavaScript(script),
  }));

  const injectedJS = `
    (function() {
      window.OdooMobileApp = {
        version: '1.0.0',
        platform: '${Platform.OS}',
        sendToNative: function(type, payload) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
        },
        notifyNative: function(title, body, data) {
          this.sendToNative('NOTIFICATION', { title, body, data });
        },
        haptic: function(style) {
          this.sendToNative('HAPTIC', { style });
        },
        openScanner: function(callbackId) {
          this.sendToNative('OPEN_SCANNER', { callbackId });
        },
        share: function(url, title) {
          this.sendToNative('SHARE', { url, title });
        },
        pickFile: function() {
          this.sendToNative('PICK_FILE', {});
        }
      };
      
      // Intercept session expiry
      const originalFetch = window.fetch;
      window.fetch = function() {
        return originalFetch.apply(this, arguments).then(response => {
          if (response.status === 401 || (response.url.includes('/web/login') && !response.url.includes('redirect'))) {
            window.OdooMobileApp.sendToNative('SESSION_EXPIRED', {});
          }
          return response;
        });
      };

      // Listen for hash changes if it's an SPA
      window.addEventListener('hashchange', function() {
        window.OdooMobileApp.sendToNative('NAVIGATE', { url: window.location.href });
      });

      true;
    })();
  `;

  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [canGoBack]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      const { type, payload } = data;

      switch (type) {
        case 'HAPTIC':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'SHARE':
          Sharing.shareAsync(payload.url, { dialogTitle: payload.title });
          break;
        case 'SESSION_EXPIRED':
          onSessionExpired?.();
          break;
        case 'NAVIGATE':
          onNavigate?.(payload.url);
          break;
        default:
          console.log('Unhandled bridge message:', type, payload);
      }
    } catch (e) {
      console.error('Failed to parse message from WebView', e);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    webViewRef.current?.reload();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ 
          uri: url,
          headers: session ? { 'X-Openerp-Session-Id': session.session_id } : {}
        }}
        injectedJavaScript={injectedJS}
        onMessage={handleMessage}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
          // Detect Odoo redirect to login as session expiry
          if (navState.url.includes('/web/login') && session) {
            onSessionExpired?.();
          }
        }}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={true}
        pullToRefreshEnabled={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

OdooWebView.displayName = 'OdooWebView';

export default OdooWebView;
