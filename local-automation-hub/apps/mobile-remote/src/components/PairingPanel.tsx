import type { ConfirmPairingResponse, CreatePairingSessionResponse } from '../types/contracts';

interface PairingPanelProps {
  desktopAgentUrl: string;
  deviceName: string;
  pairingCode: string;
  isPaired: boolean;
  isLoading: boolean;
  error?: string;
  pairingSession?: CreatePairingSessionResponse;
  pairingResult?: ConfirmPairingResponse;
  onDesktopAgentUrlChange: (value: string) => void;
  onDeviceNameChange: (value: string) => void;
  onPairingCodeChange: (value: string) => void;
  onCreateSession: () => void;
  onConfirmPairing: () => void;
  onForgetPairing: () => void;
}

export function PairingPanel({
  desktopAgentUrl,
  deviceName,
  pairingCode,
  isPaired,
  isLoading,
  error,
  pairingSession,
  pairingResult,
  onDesktopAgentUrlChange,
  onDeviceNameChange,
  onPairingCodeChange,
  onCreateSession,
  onConfirmPairing,
  onForgetPairing,
}: PairingPanelProps) {
  return (
    <section className="card pairing-card">
      <h2>Secure Pairing</h2>
      <p className="helper-text">
        Pairing stores only a local desktop-agent session token for this remote. It does not store Discord or
        third-party integration credentials on the phone.
      </p>

      <label htmlFor="desktopAgentUrl">Desktop Agent URL</label>
      <input
        id="desktopAgentUrl"
        value={desktopAgentUrl}
        onChange={(event) => onDesktopAgentUrlChange(event.target.value)}
        placeholder="http://localhost:8080"
      />

      <label htmlFor="deviceName">Device name</label>
      <input
        id="deviceName"
        value={deviceName}
        onChange={(event) => onDeviceNameChange(event.target.value)}
        placeholder="My Phone"
      />

      <div className="button-row">
        <button disabled={isLoading || isPaired} onClick={onCreateSession} type="button">
          Create Desktop Pairing Session
        </button>
      </div>

      {pairingSession ? (
        <div className="result-panel">
          <h3>Temporary pairing session</h3>
          <p>Code: <strong>{pairingSession.pairingCode}</strong></p>
          <p>Expires in: {pairingSession.expiresInSeconds} seconds</p>
          <p>{pairingSession.instructions}</p>
        </div>
      ) : null}

      <label htmlFor="pairingCode">Pairing code</label>
      <input
        id="pairingCode"
        inputMode="numeric"
        maxLength={6}
        value={pairingCode}
        onChange={(event) => onPairingCodeChange(event.target.value)}
        placeholder="482913"
      />

      <div className="button-row">
        <button disabled={isLoading || isPaired || pairingCode.trim().length === 0} onClick={onConfirmPairing} type="button">
          Pair Device
        </button>
        <button className="secondary" disabled={!isPaired} onClick={onForgetPairing} type="button">
          Forget Pairing
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}
      {isPaired && pairingResult ? (
        <p className="online">Paired with Desktop Agent as {pairingResult.deviceName}.</p>
      ) : null}
    </section>
  );
}
