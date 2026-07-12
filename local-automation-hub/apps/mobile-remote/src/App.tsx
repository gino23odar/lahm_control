import { useEffect, useState } from 'react';
import {
  confirmPairing,
  createPairingSession,
  defaultDesktopAgentUrl,
  getDeviceStatus,
  previewCommand,
} from './api/desktopAgentClient';
import { CommandPreview } from './components/CommandPreview';
import { IntegrationStatus } from './components/IntegrationStatus';
import { PairingPanel } from './components/PairingPanel';
import { StatusCard } from './components/StatusCard';
import type {
  CommandPreviewResponse,
  ConfirmPairingResponse,
  CreatePairingSessionResponse,
  DeviceStatusResponse,
} from './types/contracts';
import './styles.css';

interface StoredPairingState {
  desktopAgentUrl: string;
  deviceId: string;
  deviceName: string;
  sessionToken: string;
}

const pairingStorageKey = 'localAutomationHub.pairing';

function loadStoredPairing(): StoredPairingState | undefined {
  const stored = localStorage.getItem(pairingStorageKey);
  return stored ? JSON.parse(stored) as StoredPairingState : undefined;
}

export default function App() {
  const storedPairing = loadStoredPairing();
  const [desktopAgentUrl, setDesktopAgentUrl] = useState(storedPairing?.desktopAgentUrl ?? defaultDesktopAgentUrl);
  const [deviceName, setDeviceName] = useState(storedPairing?.deviceName ?? 'My Phone');
  const [pairingCode, setPairingCode] = useState('');
  const [sessionToken, setSessionToken] = useState(storedPairing?.sessionToken);
  const [pairingSession, setPairingSession] = useState<CreatePairingSessionResponse>();
  const [pairingResult, setPairingResult] = useState<ConfirmPairingResponse | undefined>(
    storedPairing
      ? { paired: true, deviceId: storedPairing.deviceId, deviceName: storedPairing.deviceName, sessionToken: storedPairing.sessionToken }
      : undefined,
  );
  const [pairingError, setPairingError] = useState<string>();
  const [isPairingLoading, setIsPairingLoading] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatusResponse>();
  const [statusError, setStatusError] = useState<string>();
  const [commandText, setCommandText] = useState('Fetch my Discord user info');
  const [previewResult, setPreviewResult] = useState<CommandPreviewResponse>();
  const [previewError, setPreviewError] = useState<string>();
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    getDeviceStatus(desktopAgentUrl, sessionToken)
      .then((status) => {
        setDeviceStatus(status);
        setStatusError(undefined);
      })
      .catch((error: Error) => setStatusError(error.message));
  }, [desktopAgentUrl, sessionToken]);

  async function handleCreatePairingSession() {
    setIsPairingLoading(true);
    setPairingError(undefined);
    try {
      const session = await createPairingSession(desktopAgentUrl);
      setPairingSession(session);
      setPairingCode(session.pairingCode);
    } catch (error) {
      setPairingError(error instanceof Error ? error.message : 'Unable to create pairing session');
    } finally {
      setIsPairingLoading(false);
    }
  }

  async function handleConfirmPairing() {
    setIsPairingLoading(true);
    setPairingError(undefined);
    try {
      const result = await confirmPairing(desktopAgentUrl, { pairingCode, deviceName });
      setPairingResult(result);
      setSessionToken(result.sessionToken);
      localStorage.setItem(pairingStorageKey, JSON.stringify({
        desktopAgentUrl,
        deviceId: result.deviceId,
        deviceName: result.deviceName,
        sessionToken: result.sessionToken,
      } satisfies StoredPairingState));
    } catch (error) {
      setPairingError(error instanceof Error ? error.message : 'Unable to confirm pairing');
    } finally {
      setIsPairingLoading(false);
    }
  }

  function handleForgetPairing() {
    localStorage.removeItem(pairingStorageKey);
    setSessionToken(undefined);
    setPairingResult(undefined);
    setPairingSession(undefined);
    setPairingCode('');
  }

  async function handlePreview() {
    setIsPreviewLoading(true);
    setPreviewError(undefined);
    try {
      setPreviewResult(await previewCommand(desktopAgentUrl, sessionToken, commandText));
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

      <PairingPanel
        desktopAgentUrl={desktopAgentUrl}
        deviceName={deviceName}
        error={pairingError}
        isLoading={isPairingLoading}
        isPaired={Boolean(sessionToken)}
        pairingCode={pairingCode}
        pairingResult={pairingResult}
        pairingSession={pairingSession}
        onCreateSession={handleCreatePairingSession}
        onDesktopAgentUrlChange={setDesktopAgentUrl}
        onDeviceNameChange={setDeviceName}
        onForgetPairing={handleForgetPairing}
        onPairingCodeChange={setPairingCode}
        onConfirmPairing={handleConfirmPairing}
      />

      <StatusCard title="Connection Status">
        <p>Desktop agent URL: <code>{desktopAgentUrl}</code></p>
        <p className={statusError ? 'offline' : 'online'}>{statusError ? 'Disconnected' : 'Ready to connect'}</p>
        <p className={sessionToken ? 'online' : 'offline'}>
          {sessionToken ? 'Paired with Desktop Agent' : 'Not paired yet'}
        </p>
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
