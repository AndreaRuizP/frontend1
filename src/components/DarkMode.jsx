export default function DarkMode({ checked, onChange }) {
  const isDark = Boolean(checked);

  return (
    <button
      type="button"
      onClick={() => onChange && onChange(!isDark)}
      className="flex items-center justify-center w-11 h-11 bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        <i className="bi bi-moon-fill text-xl text-yellow-400 block min-w-[20px] min-h-[20px]"></i>
      ) : (
        <i className="bi bi-sun-fill text-xl text-[#FDB022] block min-w-[20px] min-h-[20px]"></i>
      )}
    </button>
  );
}