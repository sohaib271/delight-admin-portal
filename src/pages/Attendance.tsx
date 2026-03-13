import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { attendanceRecords, classes } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import TableSkeleton from "@/components/TableSkeleton";

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("5th Class");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = attendanceRecords.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <TableSkeleton rows={6} cols={6} />;

  return (
    <div>
      <PageHeader
        title="Attendance"
        totalLabel="Total Students"
        totalCount={filtered.length}
        search={search}
        onSearchChange={setSearch}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        classes={classes}
        searchPlaceholder="Search Student..."
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto rounded-xl border border-border bg-card shadow-card"
      >
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              {["S.No", "Student ID", "Student Name", "Father's Name", "Class", "Total"].map((h) => (
                <th key={h} className="table-header p-4 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <motion.tr
                key={r.sno}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <td className="p-4 text-sm">{String(r.sno).padStart(2, "0")}</td>
                <td className="p-4 text-sm font-medium">{r.studentId}</td>
                <td className="p-4 text-sm">{r.name}</td>
                <td className="p-4 text-sm text-muted-foreground">{r.fatherName}</td>
                <td className="p-4 text-sm">{r.class}</td>
                <td className="p-4 text-sm font-semibold">{r.total}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Attendance;
