# Odoo Mobile JS Bridge API

The Odoo Mobile app injects a `window.OdooMobileApp` global object into the WebView. Odoo developers can use this object to trigger native mobile functionality.

## API Reference

### `OdooMobileApp.haptic(style)`
Triggers native haptic feedback.
- `style`: 'light', 'medium', 'heavy', 'success', 'warning', 'error'

### `OdooMobileApp.openScanner(callbackId)`
Opens the native QR/Barcode scanner. Returns the result to the provided callback function reference.

### `OdooMobileApp.share(url, title)`
Opens the native system share sheet.

### `OdooMobileApp.notifyNative(title, body, data)`
Schedules a local notification on the device.

### `OdooMobileApp.sendToNative(type, payload)`
Low-level function for custom event types.
