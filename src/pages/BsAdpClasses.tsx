import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ChevronLeft, Building2, BookOpen, Plus, Search, Check, X, UserCircle, Clock, Users } from "lucide-react";
import { professors, students } from "@/data/mockData";

const teacherSubjects: Record<string, string[]> = {
  p1: ["Physics", "Applied Physics", "Mechanics"],
  p2: ["Mathematics", "Statistics", "Calculus"],
  p3: ["Physics", "Thermodynamics", "Optics"],
  p4: ["English", "Literature", "Grammar"],
  p5: ["Chemistry", "Organic Chemistry", "Biochemistry"],
};

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

const classDates = [
  { date: "2025-03-10", day: "Monday" },
  { date: "2025-03-11", day: "Tuesday" },
  { date: "2025-03-12", day: "Wednesday" },
  { date: "2025-03-13", day: "Thursday" },
  { date: "2025-03-14", day: "Friday" },
];

const lecturesByDate: Record<string, { id: string; subject: string; time: string; duration: string; teacher: string; presentPercent: number }[]> = {
  "2025-03-10": [
    { id: "l1", subject: "Data Structures", time: "09:00 AM", duration: "40 mins", teacher: "Rajesh Sharma", presentPercent: 85 },
    { id: "l2", subject: "Calculus", time: "10:00 AM", duration: "40 mins", teacher: "Amit Patel", presentPercent: 92 },
    { id: "l3", subject: "Technical Writing", time: "11:00 AM", duration: "40 mins", teacher: "Priya Nair", presentPercent: 78 },
  ],
  "2025-03-11": [
    { id: "l4", subject: "Organic Chemistry", time: "09:00 AM", duration: "40 mins", teacher: "Vikram Singh", presentPercent: 88 },
    { id: "l5", subject: "Linear Algebra", time: "10:00 AM", duration: "40 mins", teacher: "Sunita Verma", presentPercent: 95 },
  ],
  "2025-03-12": [
    { id: "l6", subject: "Thermodynamics", time: "09:00 AM", duration: "40 mins", teacher: "Rajesh Sharma", presentPercent: 80 },
    { id: "l7", subject: "Statistics", time: "10:30 AM", duration: "40 mins", teacher: "Amit Patel", presentPercent: 90 },
  ],
  "2025-03-13": [
    { id: "l8", subject: "Literature", time: "09:00 AM", duration: "40 mins", teacher: "Priya Nair", presentPercent: 82 },
  ],
  "2025-03-14": [
    { id: "l9", subject: "Biochemistry", time: "09:00 AM", duration: "40 mins", teacher: "Vikram Singh", presentPercent: 91 },
    { id: "l10", subject: "Mechanics", time: "11:00 AM", duration: "40 mins", teacher: "Rajesh Sharma", presentPercent: 87 },
  ],
};

const classStudents = students.filter((s) => s.category === "bs_adp").map((s, i) => ({
  ...s,
  status: i % 3 === 0 ? "Absent" as const : "Present" as const,
}));

type View = "list" | "dates" | "lectures" | "lectureDetail";

const BsAdpClasses = () => {
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Drill-down state
  const [view, setView] = useState<View>("list");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLecture, setSelectedLecture] = useState("");

  // Form state
  const [formClassName, setFormClassName] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formSession, setFormSession] = useState("");
  const [formTeacherDropdown, setFormTeacherDropdown] = useState(false);
  const [formExpandedTeacher, setFormExpandedTeacher] = useState<string | null>(null);
  const [formSelectedTeachers, setFormSelectedTeachers] = useState<{ teacherId: string; subject: string }[]>([]);
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
    setFormExpandedTeacher(null);
    setShowAddForm(false);
  };

  const goBack = () => {
    if (view === "lectureDetail") setView("lectures");
    else if (view === "lectures") setView("dates");
    else if (view === "dates") setView("list");
  };

  const currentLectures = lecturesByDate[selectedDate] || [];
  const currentLecture = currentLectures.find((l) => l.id === selectedLecture);

  // Lecture Detail View
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

  // Lectures View
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
          {selectedSection} · {currentLectures.length} lectures
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

  // Dates View
  if (view === "dates") {
    return (
      <div>
        <button onClick={goBack} className="mb-4 flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to Departments
        </button>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-1 font-display text-xl font-bold text-foreground sm:text-2xl">
          {selectedSection}
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

  // Main department list view
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
                                    <div
                                      key={sec}
                                      onClick={() => { setSelectedSection(`${dept.name} — ${cls.name} — ${sec}`); setView("dates"); }}
                                      className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2 text-sm text-foreground cursor-pointer hover:bg-secondary transition-colors"
                                    >
                                      <div className="h-2 w-2 rounded-full bg-primary" />
                                      {sec}
                                      <span className="ml-auto text-xs text-primary">View →</span>
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
                    {formSelectedTeachers.length > 0
                      ? formSelectedTeachers.map((t) => {
                          const prof = professors.find((p) => p.id === t.teacherId);
                          return prof ? `${prof.firstName} (${t.subject})` : "";
                        }).join(", ")
                      : "Select teachers"}
                  </button>
                  <AnimatePresence>
                    {formTeacherDropdown && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-elevated max-h-60 overflow-y-auto">
                        {professors.map((p) => {
                          const isSelected = formSelectedTeachers.some((t) => t.teacherId === p.id);
                          const selectedSubject = formSelectedTeachers.find((t) => t.teacherId === p.id)?.subject;
                          const subjects = teacherSubjects[p.id] || [];
                          const isExpanded = formExpandedTeacher === p.id;
                          return (
                            <div key={p.id}>
                              <button
                                onClick={() => {
                                  if (isSelected) {
                                    setFormSelectedTeachers((prev) => prev.filter((t) => t.teacherId !== p.id));
                                    setFormExpandedTeacher(null);
                                  } else {
                                    setFormExpandedTeacher(isExpanded ? null : p.id);
                                  }
                                }}
                                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-secondary/50 transition-colors"
                              >
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <UserCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{p.firstName} {p.lastName}</p>
                                  <p className="text-xs text-muted-foreground">{isSelected ? `Selected: ${selectedSubject}` : p.department}</p>
                                </div>
                                {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                              </button>
                              <AnimatePresence>
                                {isExpanded && !isSelected && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-secondary/30">
                                    {subjects.map((sub) => (
                                      <button
                                        key={sub}
                                        onClick={() => {
                                          setFormSelectedTeachers((prev) => [...prev, { teacherId: p.id, subject: sub }]);
                                          setFormExpandedTeacher(null);
                                        }}
                                        className="flex w-full items-center gap-2 px-8 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
                                      >
                                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                        {sub}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
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
