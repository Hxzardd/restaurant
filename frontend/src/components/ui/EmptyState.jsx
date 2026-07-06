export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="card p-16 text-center">
      {Icon && <Icon size={56} className="mx-auto mb-5 text-ink-soft/50" aria-hidden="true" />}
      <p className="font-display text-2xl font-bold mb-2">{title}</p>
      <p className="text-sm text-ink-soft">{text}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
