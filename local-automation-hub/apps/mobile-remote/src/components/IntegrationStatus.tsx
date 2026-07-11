import type { IntegrationStatus as IntegrationStatusType } from '../types/contracts';

interface IntegrationStatusProps {
  integrations: IntegrationStatusType[];
}

function formatStatus(status: string): string {
  return status.replaceAll('_', ' ').replace(/^./, (char) => char.toUpperCase());
}

export function IntegrationStatus({ integrations }: IntegrationStatusProps) {
  return (
    <ul className="integration-list">
      {integrations.map((integration) => (
        <li key={integration.name}>
          <span>{integration.name}</span>
          <strong>{formatStatus(integration.status)}</strong>
        </li>
      ))}
    </ul>
  );
}
