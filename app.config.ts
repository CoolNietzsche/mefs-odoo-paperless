export const AppConfig = {
  // Server
  defaultServerUrl: 'https://erp.messeret.com',              // Pre-filled for enterprise deployments
  allowServerChange: true,           // Lock to single server if false
  
  // Features
  enableBiometrics: true,
  enablePushNotifications: true,
  enableQrScanner: true,
  enableOfflineMode: true,
  enableFileDownload: true,
  enableDarkMode: true,
  enableAppLock: true,
  enableScreenshotPrevention: false,
  enableRootDetection: false,
  enableSSLPinning: false,           // true in production
  
  // UI
  primaryColor: '#875A7B',           // Odoo purple default
  companyName: 'Messeret',
  showBottomTabs: true,
  enablePullToRefresh: true,
  
  // Timeouts
  sessionTimeout: 7 * 24 * 60,      // minutes
  appLockTimeout: 5,                 // minutes of idle before lock
  apiTimeout: 30000,                 // ms
  
  // Notifications
  defaultNotificationCategories: ['messages', 'activities', 'approvals'],
  
  // Deep linking
  urlScheme: 'odoomobile',
  universalLinkDomain: '',
};
