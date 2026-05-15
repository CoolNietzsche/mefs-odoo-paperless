# MEFS (Odoo Mobile)

Production-ready mobile wrapper for Messeret Odoo 18.

## Features
- **Native UI Shell**: Bottom tabs, native headers, translucent blur effects.
- **Biometrics**: Face ID / Fingerprint login support.
- **Push Notifications**: Integrated with Odoo mail.message via Expo.
- **JS Bridge**: Communicate between Odoo and Native (scanner, sharing, etc).
- **Scanner**: QR/Barcode scanning for inventory and actions.
- **Offline Mode**: Connection monitoring and offline caching.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI
- Odoo 18 Community Edition

### Frontend Setup
1. `npm install`
2. Configure `.env` with your Odoo URL
3. `npm run dev`

### Odoo Backend Setup
1. Copy `odoo_modules/mobile_push_notifications` to your Odoo addons path.
2. Install the module in Odoo.
3. Configure your Expo credentials in the module settings.

## JS Bridge API
User `window.OdooMobileApp` in your Odoo JS views to access native features:
```javascript
OdooMobileApp.openScanner(result => {
  console.log("Scanned:", result);
});
```
