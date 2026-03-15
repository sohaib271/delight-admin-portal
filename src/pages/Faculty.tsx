import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Plus, X, ChevronRight } from "lucide-react";
import { professors as mockProfessors, principals as mockPrincipals, vicePrincipals as mockVicePrincipals, type FacultyMember } from "@/data/mockData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FacultyType = "professor" | "principal" | "vice_principal";

const Faculty = () => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<FacultyType>("professor");
  const [professors, setProfessors] = useState(mockProfessors);
  const [principalList, setPrincipalList] = useState(mockPrincipals);
  const [vpList, setVpList] = useState(mockVicePrincipals);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({ firstName: "", lastName: "", doj: "", hod: "No", department: "" });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const openModal = (type: FacultyType) => {
    setModalType(type);
    setForm({ firstName: "", lastName: "", doj: "", hod: "No", department: "" });
    setShowModal(true);
  };

  const handleSave = () => {
    const newMember: FacultyMember = {
      id: crypto.randomUUID(),
      firstName: form.firstName,
      lastName: form.lastName,
      doj: form.doj,
      ...(modalType === "professor" ? { hod: form.hod, department: form.department } : {}),
    };
    if (modalType === "professor") setProfessors((p) => [...p, newMember]);
    else if (modalType === "principal") setPrincipalList((p) => [...p, newMember]);
    else setVpList((p) => [...p, newMember]);
    setShowModal(false);
  };

  if (loading) return <TableSkeleton rows={6} cols={5} />;

  const renderTable = (data: FacultyMember[], type: FacultyType, showAll: boolean) => {
    const displayData = showAll ? data : data.slice(0, 3);
    const isProfessor = type === "professor";

    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              {["S.No", "First Name", "Last Name", "Date of Joining", ...(isProfessor ? ["HOD", "Department"] : []), "Action"].map((h) => (
                <th key={h} className="table-header p-4 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((m, i) => (
              <motion.tr
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <td className="p-4 text-sm">{String(i + 1).padStart(2, "0")}</td>
                <td className="p-4 text-sm font-medium">{m.firstName}</td>
                <td className="p-4 text-sm">{m.lastName}</td>
                <td className="p-4 text-sm text-muted-foreground">{m.doj}</td>
                {isProfessor && (
                  <>
                    <td className="p-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${m.hod === "Yes" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {m.hod}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{m.department}</td>
                  </>
                )}
                <td className="p-4">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
                    <Eye className="h-4 w-4" />
                    View Detail
                  </Button>
                </td>
              </motion.tr>
            ))}
            {displayData.length === 0 && (
              <tr>
                <td colSpan={isProfessor ? 7 : 5} className="p-8 text-center text-sm text-muted-foreground">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const sections: { title: string; type: FacultyType; data: FacultyMember[]; count: number }[] = [
    { title: "Professors", type: "professor", data: professors, count: professors.length },
    { title: "Principal", type: "principal", data: principalList, count: principalList.length },
    { title: "Vice Principal", type: "vice_principal", data: vpList, count: vpList.length },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Faculty</h2>
          <p className="text-sm text-muted-foreground">Manage professors, principal & vice principals</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-lg bg-primary/10 px-3 py-1.5 font-semibold text-primary">
            Total Faculty: {professors.length + principalList.length + vpList.length}
          </span>
        </div>
      </motion.div>

      {/* Sections */}
      {sections.map((section, sIdx) => {
        const isExpanded = expandedSection === section.type;
        return (
          <motion.div
            key={section.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.1 }}
            className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-lg font-semibold text-foreground">{section.title}</h3>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {section.count}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {section.data.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-primary hover:text-primary"
                    onClick={() => setExpandedSection(isExpanded ? null : section.type)}
                  >
                    {isExpanded ? "Show Less" : "View All"}
                    <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </Button>
                )}
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => openModal(section.type)}
                >
                  <Plus className="h-4 w-4" />
                  Add More
                </Button>
              </div>
            </div>

            {/* Table */}
            {renderTable(section.data, section.type, isExpanded)}
          </motion.div>
        );
      })}

      {/* Add Faculty Modal */}
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
                <h2 className="font-display text-xl font-bold text-foreground">
                  Add {modalType === "professor" ? "Professor" : modalType === "principal" ? "Principal" : "Vice Principal"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">First Name</label>
                  <Input placeholder="Enter first name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Last Name</label>
                  <Input placeholder="Enter last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Date of Joining</label>
                  <Input type="date" value={form.doj} onChange={(e) => setForm({ ...form, doj: e.target.value })} />
                </div>
                {modalType === "professor" && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">HOD</label>
                      <select
                        value={form.hod}
                        onChange={(e) => setForm({ ...form, hod: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
                      <Input placeholder="e.g. Computer Science" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Faculty;
