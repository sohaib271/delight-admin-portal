const TableSkeleton = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-4">
          <div className="shimmer h-5 w-40 rounded" />
          <div className="shimmer h-9 w-32 rounded-md" />
          <div className="shimmer h-9 w-48 rounded-md" />
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-4">
                <div className="shimmer h-3 w-20 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b border-border last:border-0">
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="p-4">
                  <div className="shimmer h-4 w-24 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
