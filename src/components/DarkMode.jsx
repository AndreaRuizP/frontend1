export default function DarkMode({ checked, onChange }) {
  return (
    <label className="relative inline-block w-14 h-8 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="opacity-0 w-0 h-0"
      />
      <span
        className={`
          absolute inset-0 rounded-full transition-colors duration-300
          ${checked ? "bg-[#13314A]" : "bg-[#FEF3C7]"}
        `}
      ></span>
      <span
        className={`
          absolute top-1 transition-all duration-300 flex items-center justify-center
          w-6 h-6 rounded-full
          ${checked ? "left-7 bg-[#2563EB]" : "left-1 bg-[#FDE68A]"}
        `}
        style={{ boxShadow: "0 1px 6px 0 #BBB3" }}
      >
        {checked ? (
          <i className="bi bi-moon text-white text-lg flex items-center justify-center"></i>
        ) : (
          <i className="bi bi-sun-fill text-[#FDB022] text-lg flex items-center justify-center"></i>
        )}
      </span>
    </label>
  );
}
