function SortBy ({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <>
      <label htmlFor="sortBy">Sort by</label>
      <select 
        id="sortBy" 
        name="sortBy"
        value={sortBy}
        onChange={(event) => onSortByChange(event.target.value)}
      >
        <option value="createdAt">Creation Date</option>
        <option value="title">Title</option>
      </select>

      <label htmlFor="order">Order</label>
      <select 
        id="order" 
        name="order"
        value={sortDirection}
        onChange={(event) => onSortDirectionChange(event.target.value)}
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </>
  )
}

export default SortBy;