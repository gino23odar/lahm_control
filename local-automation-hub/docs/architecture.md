# Local Automation Hub Architecture

Local Automation Hub separates trusted local integration ownership from mobile remote-control convenience.

## Trust boundary

The desktop / PC local agent is the trusted application. It owns integrations, future OAuth flows, future credential storage, and future local automation capabilities. The Android mobile app is only a companion remote control UI.

The phone is not the integration hub. It must not store Discord, GitHub, Google, Slack, or other third-party OAuth tokens, client secrets, refresh tokens, or integration credentials.

## Desktop agent responsibilities

- Expose a safe local API for paired clients.
- Own future OAuth flows for third-party integrations.
- Store future credentials using OS-appropriate secure storage, not plaintext files.
- Provide device, integration, automation, and audit-log state to approved clients.
- Keep command handling preview-only until explicit approval and safe execution boundaries are implemented.
- Track mobile remote pairings and eventually enforce paired-device authorization for sensitive APIs.

## Mobile remote responsibilities

- Display desktop agent status.
- Display integration status returned by the desktop agent.
- Send remote-control requests to the desktop agent.
- Present previews and approval prompts.
- Store only the local desktop-agent pairing/session token needed for remote communication.
- Avoid direct third-party integration connections and avoid storing integration credentials.

## Pairing model

Pairing is between the mobile remote and the desktop agent. In Iteration 2, the desktop agent creates a temporary six-digit pairing code that expires after five minutes. The mobile app submits that code with a friendly device name, and the desktop agent returns a generated device identifier and random session token.

The mobile app may store the desktop agent URL and local session token in browser storage for this development-only pairing flow. It must not store Discord credentials, OAuth tokens, client secrets, integration refresh tokens, or other third-party secrets. Integration credentials stay only on the desktop agent.

Iteration 2 pairing state is in memory. Restarting the desktop agent clears temporary pairing sessions and paired devices. This is not final production security and must be hardened before real integrations or sensitive automation are enabled.

## Future OAuth model

Future OAuth should be initiated and completed by the desktop agent. The mobile app can request that the user start setup, but the desktop agent remains responsible for OAuth client configuration, token exchange, refresh, revocation, and secure token storage.

## Future AI automation safety

Future AI-assisted automation must use a proposal-first flow:

1. Generate a preview or proposed action plan.
2. Require user approval for sensitive or state-changing actions.
3. Record audit logs for proposed, approved, denied, and executed actions.
4. Execute only inside explicit safe boundaries.
5. Never allow arbitrary shell-command execution from untrusted mobile input.

Iteration 1 implemented only mock status and preview-only command handling. Iteration 2 adds local-network MVP pairing only. The project still does not implement Discord OAuth, credential storage, script execution, AI script generation, or dangerous automation features.

## Future pairing hardening

- QR code pairing
- HTTPS or local TLS
- Device approval from desktop
- Token rotation
- Persistent encrypted device registry
- Revocation of paired devices
- Request signing or mutual authentication
