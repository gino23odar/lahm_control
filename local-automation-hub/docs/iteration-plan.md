# Iteration Plan

1. **Foundation: desktop agent + mobile remote mock API**
   - Create the monorepo foundation.
   - Add a Spring Boot desktop agent with health, device status, and preview-only command APIs.
   - Add a React mobile remote UI that reads mock status and requests command previews.

2. **Pairing foundation between phone and desktop**
   - Add temporary in-memory desktop pairing sessions.
   - Add mobile pairing UI with desktop URL, device name, pairing code, and forget-pairing controls.
   - Add local session-token headers without enforcing them on all APIs yet.

3. **Discord OAuth on desktop agent**
   - Implement OAuth initiation and callback handling in the desktop agent only.

4. **Secure token storage on desktop**
   - Store OAuth tokens using operating-system secure storage or an equivalent encrypted vault.

5. **Real integration status dashboard**
   - Replace mock integration status with real desktop-owned integration health checks.

6. **AI assistant script proposal flow**
   - Add AI-generated action proposals without execution.

7. **Approval and audit log system**
   - Require approval for sensitive actions and record immutable audit events.

8. **Safe desktop automation runner**
   - Add constrained execution with allowlists, sandboxing, and clear user controls.

9. **Android APK packaging with Capacitor**
   - Wrap the mobile remote with Capacitor and produce Android builds.

## Future pairing hardening

- QR code pairing
- HTTPS or local TLS
- Device approval from desktop
- Token rotation
- Persistent encrypted device registry
- Revocation of paired devices
- Request signing or mutual authentication
