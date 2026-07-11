import type { CommandPreviewResponse } from '../types/contracts';

interface CommandPreviewProps {
  commandText: string;
  isLoading: boolean;
  result?: CommandPreviewResponse;
  error?: string;
  onCommandTextChange: (value: string) => void;
  onPreview: () => void;
}

export function CommandPreview({
  commandText,
  isLoading,
  result,
  error,
  onCommandTextChange,
  onPreview,
}: CommandPreviewProps) {
  return (
    <section className="card command-card">
      <h2>Command Preview</h2>
      <label htmlFor="commandText">Command</label>
      <textarea
        id="commandText"
        value={commandText}
        onChange={(event) => onCommandTextChange(event.target.value)}
        placeholder="Fetch my Discord user info"
        rows={4}
      />
      <button disabled={isLoading || commandText.trim().length === 0} onClick={onPreview} type="button">
        {isLoading ? 'Previewing…' : 'Preview Command'}
      </button>
      <div className="result-panel">
        <h3>Preview result</h3>
        {error ? <p className="error">{error}</p> : null}
        {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : <p>No preview yet.</p>}
      </div>
    </section>
  );
}
