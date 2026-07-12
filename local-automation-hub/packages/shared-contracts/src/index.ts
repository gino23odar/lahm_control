export interface IntegrationStatus {
  name: string;
  status: 'not_configured' | 'configured' | 'error' | string;
}

export interface AutomationEngineStatus {
  status: 'disabled_for_mvp' | 'enabled' | 'error' | string;
}

export interface DeviceStatusResponse {
  deviceName: string;
  online: boolean;
  integrations: IntegrationStatus[];
  automationEngine: AutomationEngineStatus;
}

export interface CommandPreviewRequest {
  commandText: string;
  source: 'mobile' | string;
}

export interface CommandPreviewResponse {
  accepted: boolean;
  requiresApproval: boolean;
  willExecute: boolean;
  preview: string;
}

export interface CreatePairingSessionResponse {
  pairingCode: string;
  pairingToken: string;
  expiresInSeconds: number;
  instructions: string;
}

export interface ConfirmPairingRequest {
  pairingCode: string;
  deviceName: string;
}

export interface ConfirmPairingResponse {
  paired: boolean;
  deviceId: string;
  deviceName: string;
  sessionToken: string;
}

export interface PairedDevice {
  deviceId: string;
  deviceName: string;
  pairedAt: string;
  lastSeenAt: string;
}

export interface ListPairedDevicesResponse {
  devices: PairedDevice[];
}
