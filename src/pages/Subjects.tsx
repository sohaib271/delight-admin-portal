import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { subjects as mockSubjects, classes } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import TableSkeleton from "@/components/TableSkeleton";

const Subjects = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("5th Class");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = mockSubjects.filter(
    (s) => s.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <TableSkeleton rows={6} cols={5} />;

  return (
    <div>
      <PageHeader
        title="Subjects"
        totalLabel="Total Subjects"
        totalCount={filtered.length}
        search={search}
        onSearchChange={setSearch}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        classes={classes}
        searchPlaceholder="Search Subject..."
        onAdd={() => {}}
        addLabel="Add Subject"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto rounded-xl border border-border bg-card shadow-card"
      >
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-border">
              {["S.No", "Subject", "Total Marks", "Passing Marks", "Actions"].map((h) => (
                <th key={h} className="table-header p-4 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <td className="p-4 text-sm">{String(s.sno).padStart(2, "0")}</td>
                <td className="p-4 text-sm font-medium">{s.subject}</td>
                <td className="p-4 text-sm">{s.totalMarks}</td>
                <td className="p-4 text-sm">{s.passingMarks}</td>
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

export default Subjects;
