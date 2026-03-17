import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, Users, Clock, BookOpen, Plus, Search, Check, X, UserCircle } from "lucide-react";
import { professors, students } from "@/data/mockData";

const teacherSubjects: Record<string, string[]> = {
  p1: ["Physics", "Applied Physics", "Mechanics"],
  p2: ["Mathematics", "Statistics", "Calculus"],
  p3: ["Physics", "Thermodynamics", "Optics"],
  p4: ["English", "Literature", "Grammar"],
  p5: ["Chemistry", "Organic Chemistry", "Biochemistry"],
};

const intermediateClassData = [
  {
    name: "1st Year",
    classes: [
      { name: "ICS-PHY-PB7-I", teacher: "Rajesh Sharma" },
      { name: "PRE-MED-RA3-I", teacher: "Sunita Verma" },
      { name: "ICS-MATH-PC2-I", teacher: "Amit Patel" },
    ],
  },
  {
    name: "2nd Year",
    classes: [
      { name: "PRE-ENG-RB9-II", teacher: "Priya Nair" },
      { name: "ICS-CS-PA5-II", teacher: "Vikram Singh" },
    ],
  },
];

const classDates = [
  { date: "2025-03-10", day: "Monday" },
  { date: "2025-03-11", day: "Tuesday" },
  { date: "2025-03-12", day: "Wednesday" },
  { date: "2025-03-13", day: "Thursday" },
  { date: "2025-03-14", day: "Friday" },
];

const lecturesByDate: Record<string, { id: string; subject: string; time: string; duration: string; teacher: string; presentPercent: number }[]> = {
  "2025-03-10": [
    { id: "l1", subject: "Physics", time: "09:00 AM", duration: "40 mins", teacher: "Rajesh Sharma", presentPercent: 85 },
    { id: "l2", subject: "Mathematics", time: "10:00 AM", duration: "40 mins", teacher: "Amit Patel", presentPercent: 92 },
    { id: "l3", subject: "English", time: "11:00 AM", duration: "40 mins", teacher: "Priya Nair", presentPercent: 78 },
  ],
  "2025-03-11": [
    { id: "l4", subject: "Chemistry", time: "09:00 AM", duration: "40 mins", teacher: "Vikram Singh", presentPercent: 88 },
    { id: "l5", subject: "Computer Science", time: "10:00 AM", duration: "40 mins", teacher: "Sunita Verma", presentPercent: 95 },
  ],
  "2025-03-12": [
    { id: "l6", subject: "Physics", time: "09:00 AM", duration: "40 mins", teacher: "Rajesh Sharma", presentPercent: 80 },
    { id: "l7", subject: "Mathematics", time: "10:30 AM", duration: "40 mins", teacher: "Amit Patel", presentPercent: 90 },
  ],
  "2025-03-13": [
    { id: "l8", subject: "English", time: "09:00 AM", duration: "40 mins", teacher: "Priya Nair", presentPercent: 82 },
  ],
  "2025-03-14": [
    { id: "l9", subject: "Chemistry", time: "09:00 AM", duration: "40 mins", teacher: "Vikram Singh", presentPercent: 91 },
    { id: "l10", subject: "Physics", time: "11:00 AM", duration: "40 mins", teacher: "Rajesh Sharma", presentPercent: 87 },
  ],
};

const classStudents = students.filter((s) => s.category === "intermediate").map((s, i) => ({
  ...s,
  status: i % 3 === 0 ? "Absent" as const : "Present" as const,
}));

type View = "list" | "dates" | "lectures" | "lectureDetail";

const IntermediateClasses = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<View>("list");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedLecture, setSelectedLecture] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formClassName, setFormClassName] = useState("");
  const [formPart, setFormPart] = useState("");
  const [formTeacherDropdown, setFormTeacherDropdown] = useState(false);
  const [formExpandedTeacher, setFormExpandedTeacher] = useState<string | null>(null);
  const [formSelectedTeachers, setFormSelectedTeachers] = useState<{ teacherId: string; subject: string }[]>([]);
  const [formStudentSearch, setFormStudentSearch] = useState("");
  const [formSelectedStudents, setFormSelectedStudents] = useState<string[]>([]);

  const interStudents = students.filter((s) => s.category === "intermediate");

  const filteredFormStudents = interStudents.filter(
    (s) => s.name.toLowerCase().includes(formStudentSearch.toLowerCase()) || s.studentId.toLowerCase().includes(formStudentSearch.toLowerCase())
  );

  const goBack = () => {
    if (view === "lectureDetail") setView("lectures");
    else if (view === "lectures") setView("dates");
    else if (view === "dates") setView("list");
  };

  const currentLectures = lecturesByDate[selectedDate] || [];
  const currentLecture = currentLectures.find((l) => l.id === selectedLecture);

  const resetForm = () => {
    setFormClassName("");
    setFormPart("");
    setFormSelectedTeachers([]);
    setFormSelectedStudents([]);
    setFormStudentSearch("");
    setFormExpandedTeacher(null);
    setShowAddForm(false);
  };

  if (view === "lectureDetail" && currentLecture) {
    return (
      <div>
        <button onClick={goBack} className="mb-4 flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to Lectures
        </button>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-1 font-display text-xl font-bold text-foreground sm:text-2xl">
          {currentLecture.subject}
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-primary" />
            </div>
            {currentLecture.teacher}
          </span>
          <span>Total Students: {classStudents.length}</span>
        </motion.div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-display font-semibold text-foreground">S.No</th>
                <th className="px-4 py-3 text-left font-display font-semibold text-foreground">Student ID</th>
                <th className="px-4 py-3 text-left font-display font-semibold text-foreground">Name</th>
                <th className="px-4 py-3 text-left font-display font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((st, i) => (
                <motion.tr key={st.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{st.studentId}</td>
                  <td className="px-4 py-3 text-foreground">{st.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${st.status === "Present" ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive"}`}>
                      {st.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === "lectures") {
    const dateObj = classDates.find((d) => d.date === selectedDate);
    return (
      <div>
        <button onClick={goBack} className="mb-4 flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to Dates
        </button>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-1 font-display text-xl font-bold text-foreground sm:text-2xl">
          Lectures — {dateObj?.day}, {selectedDate}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mb-6 text-sm text-muted-foreground">
          Class: {selectedClass} · {currentLectures.length} lectures
        </motion.p>
        <div className="space-y-3">
          {currentLectures.map((lec, i) => (
            <motion.div
              key={lec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { setSelectedLecture(lec.id); setView("lectureDetail"); }}
              className="group cursor-pointer rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground">{lec.subject}</h3>
                    <p className="text-xs text-muted-foreground">{lec.teacher}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {lec.time} · {lec.duration}
                  </div>
                  <div className={`mt-1 text-xs font-semibold ${lec.presentPercent >= 85 ? "text-green-600" : lec.presentPercent >= 70 ? "text-yellow-600" : "text-destructive"}`}>
                    {lec.presentPercent}% Present
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {currentLectures.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No lectures recorded for this date.</p>
          )}
        </div>
      </div>
    );
  }

  if (view === "dates") {
    return (
      <div>
        <button onClick={goBack} className="mb-4 flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to Classes
        </button>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-1 font-display text-xl font-bold text-foreground sm:text-2xl">
          {selectedClass}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mb-6 text-sm text-muted-foreground">Schedule & Attendance</motion.p>
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-display font-semibold text-foreground">Date</th>
                <th className="px-4 py-3 text-left font-display font-semibold text-foreground">Day</th>
                <th className="px-4 py-3 text-left font-display font-semibold text-foreground">Lectures</th>
                <th className="px-4 py-3 text-right font-display font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {classDates.map((d, i) => (
                <motion.tr
                  key={d.date}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => { setSelectedDate(d.date); setView("lectures"); }}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{d.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.day}</td>
                  <td className="px-4 py-3 text-muted-foreground">{(lecturesByDate[d.date] || []).length} lectures</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-medium text-primary hover:underline">View →</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Main class list view
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-xl font-bold text-foreground sm:text-2xl">Intermediate Classes</motion.h1>
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
        Total Classes: {intermediateClassData.reduce((a, y) => a + y.classes.length, 0)}
      </motion.p>

      <div className="space-y-3">
        {intermediateClassData.map((year, i) => (
          <motion.div key={year.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <button onClick={() => setExpanded(expanded === year.name ? null : year.name)} className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{year.name}</h3>
                  <p className="text-xs text-muted-foreground">{year.classes.length} Classes</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expanded === year.name ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {expanded === year.name && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="border-t border-border px-4 py-3 space-y-2">
                    {year.classes.map((cls) => (
                      <div
                        key={cls.name}
                        onClick={() => { setSelectedClass(cls.name); setView("dates"); }}
                        className="flex items-center justify-between gap-2 rounded-lg bg-secondary/50 px-4 py-2.5 text-sm text-foreground cursor-pointer hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="font-medium">{cls.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{cls.teacher}</span>
                      </div>
                    ))}
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
                <h2 className="font-display text-lg font-bold text-foreground">Intermediate Class Form</h2>
                <button onClick={resetForm} className="rounded-lg p-1 hover:bg-secondary transition-colors"><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Class Name</label>
                  <input value={formClassName} onChange={(e) => setFormClassName(e.target.value)} placeholder="e.g. ICS-PHY-PB7-I" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Part</label>
                  <select value={formPart} onChange={(e) => setFormPart(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Part</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                  </select>
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

export default IntermediateClasses;
