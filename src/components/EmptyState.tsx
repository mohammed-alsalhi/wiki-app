import Link from "next/link";

type Props = {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({ icon = "O", title, description, actionLabel, actionHref }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-title">{title}</div>
      {description && <div className="empty-state-description">{description}</div>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="home-action-btn home-action-btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
