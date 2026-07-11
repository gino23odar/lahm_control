interface StatusCardProps {
  title: string;
  children: React.ReactNode;
}

export function StatusCard({ title, children }: StatusCardProps) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
