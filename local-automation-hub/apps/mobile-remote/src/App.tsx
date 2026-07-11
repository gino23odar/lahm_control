import { useEffect, useState } from 'react';
import { desktopAgentUrl, getDeviceStatus, previewCommand } from './api/desktopAgentClient';
import { CommandPreview } from './components/CommandPreview';
import { IntegrationStatus } from './components/IntegrationStatus';
import { StatusCard } from './components/StatusCard';
import type { CommandPreviewResponse, DeviceStatusResponse } from './types/contracts';
import './styles.css';

export default function App() {
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatusResponse>();
  const [statusError, setStatusError] = useState<string>();
  const [commandText, setCommandText] = useState('Fetch my Discord user info');
  const [previewResult, setPreviewResult] = useState<CommandPreviewResponse>();
  const [previewError, setPreviewError] = useState<string>();
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    getDeviceStatus()
      .then((status) => {
        setDeviceStatus(status);
        setStatusError(undefined);
      })
      .catch((error: Error) => setStatusError(error.message));
  }, []);

  async function handlePreview() {
    setIsPreviewLoading(true);
    setPreviewError(undefined);
    try {
      setPreviewResult(await previewCommand(commandText));
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Unknown preview error');
    } finally {
      setIsPreviewLoading(false);
    }
  }

  const integrations = deviceStatus?.integrations ?? [{ name: 'Discord', status: 'not_configured' }];

  return (
    <main>
      <header>
        <p className="eyebrow">Mobile remote foundation</p>
        <h1>Local Automation Hub</h1>
      </header>

      <StatusCard title="Connection Status">
        <p>Desktop agent URL: <code>{desktopAgentUrl}</code></p>
        <p className={statusError ? 'offline' : 'online'}>{statusError ? 'Disconnected' : 'Ready to connect'}</p>
        {statusError ? <p className="error">{statusError}</p> : null}
      </StatusCard>

      <StatusCard title="Desktop Status">
        <p>Device: {deviceStatus?.deviceName ?? 'Local PC'}</p>
        <p>Online: {deviceStatus?.online ?? false ? 'Yes' : 'Unknown'}</p>
        <p>Automation engine: {deviceStatus?.automationEngine.status ?? 'disabled_for_mvp'}</p>
      </StatusCard>

      <StatusCard title="Integrations">
        <IntegrationStatus integrations={integrations} />
      </StatusCard>

      <CommandPreview
        commandText={commandText}
        error={previewError}
        isLoading={isPreviewLoading}
        result={previewResult}
        onCommandTextChange={setCommandText}
        onPreview={handlePreview}
      />
    </main>
  );
}
