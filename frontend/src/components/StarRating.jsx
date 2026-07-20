function StarRating({ value = 0, onChange, size = "md" }) {
  const interactive = typeof onChange === "function";
  const sizeClass = size === "sm" ? "text-sm" : "text-2xl";

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`} aria-label={`${value || 0} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange(star)}
          disabled={!interactive}
          className={`${star <= Math.round(value) ? "text-amber-400" : "text-slate-300"} ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
      {value > 0 && <span className="ml-1 text-xs font-medium text-slate-500">{Number(value).toFixed(1)}</span>}
    </div>
  );
}

export default StarRating;
