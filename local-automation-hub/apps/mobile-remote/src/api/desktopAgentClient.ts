import type {
  CommandPreviewRequest,
  CommandPreviewResponse,
  ConfirmPairingRequest,
  ConfirmPairingResponse,
  CreatePairingSessionResponse,
  DeviceStatusResponse,
  ListPairedDevicesResponse,
} from '../types/contracts';

export const defaultDesktopAgentUrl = import.meta.env.VITE_DESKTOP_AGENT_URL ?? 'http://localhost:8080';

interface DesktopAgentClientOptions {
  baseUrl?: string;
  sessionToken?: string;
}

async function request<T>(path: string, options: RequestInit = {}, clientOptions: DesktopAgentClientOptions = {}): Promise<T> {
  const baseUrl = clientOptions.baseUrl ?? defaultDesktopAgentUrl;
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (clientOptions.sessionToken) {
    headers.set('X-Local-Automation-Session', clientOptions.sessionToken);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message ?? `Desktop agent request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function readErrorMessage(response: Response): Promise<string | undefined> {
  try {
    const body = await response.json() as { message?: string; error?: string };
    return body.message ?? body.error;
  } catch {
    return undefined;
  }
}

export function createPairingSession(baseUrl: string): Promise<CreatePairingSessionResponse> {
  return request<CreatePairingSessionResponse>('/api/pairing/session', { method: 'POST' }, { baseUrl });
}

export function confirmPairing(baseUrl: string, body: ConfirmPairingRequest): Promise<ConfirmPairingResponse> {
  return request<ConfirmPairingResponse>('/api/pairing/confirm', {
    method: 'POST',
    body: JSON.stringify(body),
  }, { baseUrl });
}

export function listPairedDevices(baseUrl: string, sessionToken?: string): Promise<ListPairedDevicesResponse> {
  return request<ListPairedDevicesResponse>('/api/pairing/devices', {}, { baseUrl, sessionToken });
}

export function getDeviceStatus(baseUrl: string, sessionToken?: string): Promise<DeviceStatusResponse> {
  return request<DeviceStatusResponse>('/api/device/status', {}, { baseUrl, sessionToken });
}

export function previewCommand(
  baseUrl: string,
  sessionToken: string | undefined,
  commandText: string,
): Promise<CommandPreviewResponse> {
  const body: CommandPreviewRequest = { commandText, source: 'mobile' };
  return request<CommandPreviewResponse>('/api/commands/preview', {
    method: 'POST',
    body: JSON.stringify(body),
  }, { baseUrl, sessionToken });
}
