import { Clock, ChefHat, Package, CheckCircle, XCircle } from "lucide-react";

/* Veg / Non-Veg badge — dot plus text label, never colour alone */
export function CategoryBadge({ category }) {
  const isVeg = category === "Veg";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
        isVeg ? "bg-olive-100 text-olive-700" : "bg-paprika-100 text-paprika-700"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${isVeg ? "bg-olive-600" : "bg-paprika-600"}`}
        aria-hidden="true"
      />
      {isVeg ? "Veg" : "Non-Veg"}
    </span>
  );
}

const STATUS_META = {
  Pending:   { classes: "bg-amber-100 text-amber-800",  icon: Clock },
  Preparing: { classes: "bg-sky-100 text-sky-800",      icon: ChefHat },
  Ready:     { classes: "bg-olive-600 text-white",      icon: Package },
  Delivered: { classes: "bg-cream-dark text-ink-soft",  icon: CheckCircle },
  Cancelled: { classes: "bg-red-100 text-red-700",      icon: XCircle },
};

/* Order status badge — "Ready" is intentionally the loudest */
export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { classes: "bg-cream-dark text-ink-soft", icon: Package };
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${meta.classes} ${
        status === "Preparing" ? "animate-pulse" : ""
      }`}
    >
      <Icon size={12} aria-hidden="true" />
      {status}
    </span>
  );
}
