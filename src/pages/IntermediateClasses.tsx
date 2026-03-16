import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users } from "lucide-react";

const intermediateClassData = [
  { name: "1st Year", sections: ["Section A", "Section B", "Section C"] },
  { name: "2nd Year", sections: ["Section A", "Section B"] },
];

const IntermediateClasses = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-2 font-display text-xl font-bold text-foreground sm:text-2xl">Intermediate Classes</motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6 text-sm text-muted-foreground">
        Total Classes: {intermediateClassData.length}
      </motion.p>

      <div className="space-y-3">
        {intermediateClassData.map((cls, i) => (
          <motion.div key={cls.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <button onClick={() => setExpanded(expanded === cls.name ? null : cls.name)} className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{cls.name}</h3>
                  <p className="text-xs text-muted-foreground">{cls.sections.length} Sections</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expanded === cls.name ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {expanded === cls.name && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="border-t border-border px-4 py-3 space-y-2">
                    {cls.sections.map((sec) => (
                      <div key={sec} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-4 py-2.5 text-sm text-foreground">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {sec}
                      </div>
                    ))}
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

export default IntermediateClasses;
