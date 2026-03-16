import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Building2, BookOpen } from "lucide-react";

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

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-2 font-display text-xl font-bold text-foreground sm:text-2xl">BS / ADP Departments & Classes</motion.h1>
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
    </div>
  );
};

export default BsAdpClasses;
