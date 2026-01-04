import { useState } from "react";

export default function DeleteButton({
  onDelete,                 // async function
  children = "מחק",
  confirm = true,
  confirmText = "בטוחה למחוק?",
  disabled = false,
  className = "",
  style = undefined,
  onError,                  // optional: (err) => void
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;

    if (confirm) {
      const ok = window.confirm(confirmText);
      if (!ok) return;
    }

    try {
      setLoading(true);
      await onDelete();
    } catch (err) {
      if (onError) onError(err);
      else alert("שגיאה במחיקה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
      style={style}
    >
      {loading ? "מוחק..." : children}
    </button>
  );
}
