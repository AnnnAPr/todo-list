export default function TextInputWithLabel({
    elementId,
    labelText,
    onChange,
    ref,
    value,
}) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input 
        type="text"
        id={elementId}
        value={value}
        onChange={onChange}
        ref={ref}
      />
    </>
  );
}