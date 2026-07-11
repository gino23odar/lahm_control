import type { CommandPreviewRequest, CommandPreviewResponse, DeviceStatusResponse } from '../types/contracts';

const desktopAgentUrl = import.meta.env.VITE_DESKTOP_AGENT_URL ?? 'http://localhost:8080';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${desktopAgentUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Desktop agent request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getDeviceStatus(): Promise<DeviceStatusResponse> {
  return request<DeviceStatusResponse>('/api/device/status');
}

export function previewCommand(commandText: string): Promise<CommandPreviewResponse> {
  const body: CommandPreviewRequest = { commandText, source: 'mobile' };
  return request<CommandPreviewResponse>('/api/commands/preview', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export { desktopAgentUrl };
