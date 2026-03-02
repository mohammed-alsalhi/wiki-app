type Variant = "default" | "accent" | "success" | "warning" | "danger";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: "sm" | "md";
};

export default function Badge({ children, variant = "default", size = "md" }: Props) {
  const variantClass = variant === "default" ? "badge" : `badge badge-${variant}`;
  const sizeClass = size === "sm" ? "badge-sm" : "";
  return <span className={`${variantClass} ${sizeClass}`.trim()}>{children}</span>;
}
