import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, X } from "lucide-react";
import { students as mockStudents, classes } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Students = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("5th Class");
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState(mockStudents);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <TableSkeleton rows={6} cols={7} />;

  return (
    <div>
      <PageHeader
        title="Students"
        totalLabel="Total Students"
        totalCount={filtered.length}
        search={search}
        onSearchChange={setSearch}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        classes={classes}
        searchPlaceholder="Search Student..."
        onAdd={() => setShowModal(true)}
        addLabel="New Student"
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
              {["S.No", "Student ID", "Student Name", "Father's Name", "Class", "DOJ", "Actions"].map((h) => (
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
                <td className="p-4 text-sm">{String(i + 1).padStart(2, "0")}</td>
                <td className="p-4 text-sm font-medium">{s.studentId}</td>
                <td className="p-4 text-sm">{s.name}</td>
                <td className="p-4 text-sm text-muted-foreground">{s.fatherName}</td>
                <td className="p-4 text-sm">{s.class}</td>
                <td className="p-4 text-sm text-muted-foreground">{s.doj}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Create Student Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-modal"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground">Create New Student</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Student ID</label>
                  <Input defaultValue={`ST-${String(students.length + 1).padStart(3, "0")}`} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Student Name</label>
                  <Input placeholder="Enter name" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Father's Name</label>
                  <Input placeholder="Enter father's name" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone Number</label>
                  <Input placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Address Details</label>
                  <textarea
                    placeholder="Enter address"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowModal(false)}>Save</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;
