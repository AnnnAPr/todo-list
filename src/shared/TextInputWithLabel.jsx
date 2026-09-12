export default function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label
        htmlFor={elementId}
        className="text-sm font-medium text-purple-400"
      >
        {labelText}
      </label>
      <input
        type="text"
        id={elementId}
        value={value}
        onChange={onChange}
        ref={ref}
        className="w-full bg-slate-900/80 border border-slate-700/70 text-slate-100 placeholder-slate-400 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition"
      />
    </div>
  );
}
