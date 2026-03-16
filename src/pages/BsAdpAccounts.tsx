import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, ArrowRight } from "lucide-react";
import { students as mockStudents, bsAdpClasses } from "@/data/mockData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const PREVIEW_COUNT = 5;

const BsAdpAccounts = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState(bsAdpClasses[0]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const allStudents = mockStudents.filter((s) => s.category === "bs_adp");
  const filtered = allStudents.filter(
    (s) => (s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase())) && s.class === selectedClass
  );
  const displayed = showAll ? filtered : filtered.slice(0, PREVIEW_COUNT);

  if (loading) return <TableSkeleton rows={5} cols={7} />;

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 font-display text-xl font-bold text-foreground sm:text-2xl">BS / ADP Accounts</motion.h1>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 flex flex-wrap items-center gap-3">
        <span className="font-display text-sm font-semibold text-foreground">Total: {filtered.length}</span>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
          {bsAdpClasses.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Student..." className="pl-9" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[700px]">
          <thead><tr className="border-b border-border">
            {["S.No", "Student ID", "Student Name", "Father's Name", "Class", "DOJ", "Fee Payment", "Actions"].map((h) => <th key={h} className="table-header p-4 text-left">{h}</th>)}
          </tr></thead>
          <tbody>
            {displayed.map((s, i) => (
              <motion.tr key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="p-4 text-sm">{String(i + 1).padStart(2, "0")}</td>
                <td className="p-4 text-sm font-medium">{s.studentId}</td>
                <td className="p-4 text-sm">{s.name}</td>
                <td className="p-4 text-sm text-muted-foreground">{s.fatherName}</td>
                <td className="p-4 text-sm">{s.class}</td>
                <td className="p-4 text-sm text-muted-foreground">{s.doj}</td>
                <td className="p-4 text-sm font-semibold">{s.feePayment}</td>
                <td className="p-4"><div className="flex gap-2">
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div></td>
              </motion.tr>
            ))}
            {displayed.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">No records found</td></tr>}
          </tbody>
        </table>
      </motion.div>

      {filtered.length > PREVIEW_COUNT && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => setShowAll(!showAll)}>{showAll ? "Show Less" : `View All (${filtered.length})`} <ArrowRight className="ml-1 h-4 w-4" /></Button>
        </div>
      )}
    </div>
  );
};

export default BsAdpAccounts;
