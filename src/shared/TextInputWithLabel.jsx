export default function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label htmlFor={elementId} className="text-sm font-medium text-purple-200">{labelText}</label>
      <input
        type="text"
        id={elementId}
        value={value}
        onChange={onChange}
        ref={ref}
        className="w-full bg-purple-950/60 border border-purple-700/60 text-purple-100 placeholder-purple-400/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      />
    </div>
  );
}
