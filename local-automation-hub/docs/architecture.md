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

## Mobile remote responsibilities

- Display desktop agent status.
- Display integration status returned by the desktop agent.
- Send remote-control requests to the desktop agent.
- Present previews and approval prompts.
- Avoid direct third-party integration connections and avoid storing integration credentials.

## Future OAuth model

Future OAuth should be initiated and completed by the desktop agent. The mobile app can request that the user start setup, but the desktop agent remains responsible for OAuth client configuration, token exchange, refresh, revocation, and secure token storage.

## Future AI automation safety

Future AI-assisted automation must use a proposal-first flow:

1. Generate a preview or proposed action plan.
2. Require user approval for sensitive or state-changing actions.
3. Record audit logs for proposed, approved, denied, and executed actions.
4. Execute only inside explicit safe boundaries.
5. Never allow arbitrary shell-command execution from untrusted mobile input.

Iteration 1 implements only mock status and preview-only command handling. It does not implement Discord OAuth, credential storage, script execution, AI script generation, or dangerous automation features.
