// Generic table driven by a column config, used by every list in the app.
//   columns: [{ key, header, render?: (row) => node, className? }]
//   rows:    objects with a unique `id`
//   onRowClick (optional): makes rows clickable
function DataTable({ columns, rows, onRowClick, emptyText = "Nothing here yet." }) {
  if (!rows.length) return <p className="muted center">{emptyText}</p>;

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={onRowClick ? "clickable" : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className={col.className}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
