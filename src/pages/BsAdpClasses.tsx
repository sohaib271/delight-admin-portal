import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Building2, BookOpen, Plus, Search, Check, X, UserCircle } from "lucide-react";
import { professors, students } from "@/data/mockData";

const departmentData = [
  {
    name: "Computer Science",
    classes: [
      { name: "BS-1st Semester", sections: ["Section A", "Section B"] },
      { name: "BS-2nd Semester", sections: ["Section A"] },
    ],
  },
  {
    name: "Mathematics",
    classes: [
      { name: "BS-1st Semester", sections: ["Section A", "Section B", "Section C"] },
      { name: "BS-2nd Semester", sections: ["Section A", "Section B"] },
    ],
  },
  {
    name: "Physics",
    classes: [
      { name: "ADP-1st Semester", sections: ["Section A"] },
      { name: "ADP-2nd Semester", sections: ["Section A", "Section B"] },
    ],
  },
  {
    name: "English",
    classes: [
      { name: "BS-1st Semester", sections: ["Section A"] },
    ],
  },
  {
    name: "Chemistry",
    classes: [
      { name: "ADP-1st Semester", sections: ["Section A", "Section B"] },
      { name: "ADP-2nd Semester", sections: ["Section A"] },
    ],
  },
];

const BsAdpClasses = () => {
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formClassName, setFormClassName] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formSession, setFormSession] = useState("");
  const [formTeacherDropdown, setFormTeacherDropdown] = useState(false);
  const [formSelectedTeachers, setFormSelectedTeachers] = useState<string[]>([]);
  const [formStudentSearch, setFormStudentSearch] = useState("");
  const [formSelectedStudents, setFormSelectedStudents] = useState<string[]>([]);

  const bsStudents = students.filter((s) => s.category === "bs_adp");

  const filteredFormStudents = bsStudents.filter(
    (s) => s.name.toLowerCase().includes(formStudentSearch.toLowerCase()) || s.studentId.toLowerCase().includes(formStudentSearch.toLowerCase())
  );

  const resetForm = () => {
    setFormClassName("");
    setFormDepartment("");
    setFormSession("");
    setFormSelectedTeachers([]);
    setFormSelectedStudents([]);
    setFormStudentSearch("");
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-xl font-bold text-foreground sm:text-2xl">BS / ADP Departments & Classes</motion.h1>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Class
        </motion.button>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6 text-sm text-muted-foreground">
        Total Departments: {departmentData.length}
      </motion.p>

      <div className="space-y-3">
        {departmentData.map((dept, i) => (
          <motion.div key={dept.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <button onClick={() => { setExpandedDept(expandedDept === dept.name ? null : dept.name); setExpandedClass(null); }} className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{dept.name}</h3>
                  <p className="text-xs text-muted-foreground">{dept.classes.length} Classes</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedDept === dept.name ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {expandedDept === dept.name && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="border-t border-border px-4 py-3 space-y-2">
                    {dept.classes.map((cls) => {
                      const classKey = `${dept.name}-${cls.name}`;
                      return (
                        <div key={cls.name} className="rounded-lg border border-border overflow-hidden">
                          <button onClick={() => setExpandedClass(expandedClass === classKey ? null : classKey)} className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-secondary/30 transition-colors">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground">{cls.name}</span>
                              <span className="text-xs text-muted-foreground">({cls.sections.length} sections)</span>
                            </div>
                            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expandedClass === classKey ? "rotate-90" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {expandedClass === classKey && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="border-t border-border px-4 py-2 space-y-1.5">
                                  {cls.sections.map((sec) => (
                                    <div key={sec} className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2 text-sm text-foreground">
                                      <div className="h-2 w-2 rounded-full bg-primary" />
                                      {sec}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Add Class Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => resetForm()}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-modal max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-bold text-foreground">Bachelor's Class Form</h2>
                <button onClick={resetForm} className="rounded-lg p-1 hover:bg-secondary transition-colors"><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Class Name</label>
                  <input value={formClassName} onChange={(e) => setFormClassName(e.target.value)} placeholder="e.g. BS-CS-101" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Department</label>
                  <select value={formDepartment} onChange={(e) => setFormDepartment(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Department</option>
                    {departmentData.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Session</label>
                  <input value={formSession} onChange={(e) => setFormSession(e.target.value)} placeholder="e.g. 2024-2025" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-foreground">Assign Teachers</label>
                  <button onClick={() => setFormTeacherDropdown(!formTeacherDropdown)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-left text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    {formSelectedTeachers.length > 0 ? `${formSelectedTeachers.length} teacher(s) selected` : "Select teachers"}
                  </button>
                  <AnimatePresence>
                    {formTeacherDropdown && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-elevated max-h-48 overflow-y-auto">
                        {professors.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setFormSelectedTeachers((prev) =>
                                prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                              );
                            }}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-secondary/50 transition-colors"
                          >
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <UserCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{p.firstName} {p.lastName}</p>
                              <p className="text-xs text-muted-foreground">{p.department}</p>
                            </div>
                            {formSelectedTeachers.includes(p.id) && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Add Students {formSelectedStudents.length > 0 && <span className="text-primary">({formSelectedStudents.length} selected)</span>}
                  </label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={formStudentSearch} onChange={(e) => setFormStudentSearch(e.target.value)} placeholder="Search students..." className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="max-h-40 overflow-y-auto rounded-lg border border-border">
                    {filteredFormStudents.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setFormSelectedStudents((prev) =>
                            prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                          );
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-secondary/50 transition-colors border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.studentId}</p>
                        </div>
                        {formSelectedStudents.includes(s.id) && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={resetForm} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
                  <button onClick={resetForm} className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Add Class</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BsAdpClasses;
