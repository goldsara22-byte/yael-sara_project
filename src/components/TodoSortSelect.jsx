export default function TodoSortSelect({ value, onChange }) {
  return (
    <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      Sort:
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="id">id</option>
        <option value="title">כותרת</option>
        <option value="completed">ביצוע</option>
      </select>
    </label>
  );
}
