/**
 * FreshnessBadge — a small colour-coded label showing how recently an article was updated.
 * Green  (≤30 days):   "Fresh"
 * Yellow (31–90 days): "Recent"
 * Orange (91–180 days):"Aging"
 * Red    (>180 days):  "Stale"
 */
type Props = { updatedAt: Date | string };

export default function FreshnessBadge({ updatedAt }: Props) {
  const ageDays = Math.floor(
    // eslint-disable-next-line react-hooks/purity
    (Date.now() - new Date(updatedAt).getTime()) / 86_400_000
  );

  let label: string;
  let cls: string;

  if (ageDays <= 30) {
    label = "Fresh";
    cls = "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
  } else if (ageDays <= 90) {
    label = "Recent";
    cls = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  } else if (ageDays <= 180) {
    label = "Aging";
    cls = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
  } else {
    label = "Stale";
    cls = "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  }

  return (
    <span
      title={`Last updated ${ageDays} day${ageDays === 1 ? "" : "s"} ago`}
      className={`inline-block px-1.5 py-px text-[10px] font-medium rounded ${cls}`}
    >
      {label}
    </span>
  );
}
