interface Props {
  certifiedAt?: Date | null;
}

export default function CertifiedBadge({ certifiedAt }: Props) {
  if (!certifiedAt) return null;
  return (
    <span
      title={`Verified by expert reviewers on ${certifiedAt.toLocaleDateString()}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200 rounded-full"
    >
      ✓ Verified
    </span>
  );
}
