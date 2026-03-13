import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { accounts as mockAccounts, classes } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import TableSkeleton from "@/components/TableSkeleton";

const Accounts = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("5th Class");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = mockAccounts.filter(
    (a) => a.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <TableSkeleton rows={6} cols={7} />;

  return (
    <div>
      <PageHeader
        title="Accounts"
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
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              {["S.No", "Student ID", "Student Name", "Father's Name", "Class", "DOJ", "Fee Payment", "Actions"].map((h) => (
                <th key={h} className="table-header p-4 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <motion.tr
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <td className="p-4 text-sm">{String(i + 1).padStart(2, "0")}</td>
                <td className="p-4 text-sm font-medium">{a.studentId}</td>
                <td className="p-4 text-sm">{a.name}</td>
                <td className="p-4 text-sm text-muted-foreground">{a.fatherName}</td>
                <td className="p-4 text-sm">{a.class}</td>
                <td className="p-4 text-sm text-muted-foreground">{a.doj}</td>
                <td className="p-4 text-sm font-semibold">{a.feePayment}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Accounts;
