import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronRight, ChevronLeft, Building2, BookOpen,
  Plus, Search, Check, X, UserCircle, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useDepartments } from "@/hooks/useDepartments";
import { useUsers } from "@/hooks/useUsers";
import ClassService from "@/services/classService";

// ─── static mock data ────────────────────────────────────────────────────────
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
    classes: [{ name: "BS-1st Semester", sections: ["Section A"] }],
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
  { date: "2025-03-10", day: "Monday"    },
  { date: "2025-03-11", day: "Tuesday"   },
  { date: "2025-03-12", day: "Wednesday" },
  { date: "2025-03-13", day: "Thursday"  },
  { date: "2025-03-14", day: "Friday"    },
];

const lecturesByDate: Record<string, { id: string; subject: string; time: string; duration: string; teacher: string; presentPercent: number }[]> = {
  "2025-03-10": [
    { id: "l1",  subject: "Data Structures",  time: "09:00 AM", duration: "40 mins", teacher: "Rajesh Sharma", presentPercent: 85 },
    { id: "l2",  subject: "Calculus",          time: "10:00 AM", duration: "40 mins", teacher: "Amit Patel",    presentPercent: 92 },
    { id: "l3",  subject: "Technical Writing", time: "11:00 AM", duration: "40 mins", teacher: "Priya Nair",    presentPercent: 78 },
  ],
  "2025-03-11": [
    { id: "l4",  subject: "Organic Chemistry", time: "09:00 AM", duration: "40 mins", teacher: "Vikram Singh",  presentPercent: 88 },
    { id: "l5",  subject: "Linear Algebra",    time: "10:00 AM", duration: "40 mins", teacher: "Sunita Verma",  presentPercent: 95 },
  ],
  "2025-03-12": [
    { id: "l6",  subject: "Thermodynamics",    time: "09:00 AM", duration: "40 mins", teacher: "Rajesh Sharma", presentPercent: 80 },
    { id: "l7",  subject: "Statistics",        time: "10:30 AM", duration: "40 mins", teacher: "Amit Patel",    presentPercent: 90 },
  ],
  "2025-03-13": [
    { id: "l8",  subject: "Literature",        time: "09:00 AM", duration: "40 mins", teacher: "Priya Nair",    presentPercent: 82 },
  ],
  "2025-03-14": [
    { id: "l9",  subject: "Biochemistry",      time: "09:00 AM", duration: "40 mins", teacher: "Vikram Singh",  presentPercent: 91 },
    { id: "l10", subject: "Mechanics",         time: "11:00 AM", duration: "40 mins", teacher: "Rajesh Sharma", presentPercent: 87 },
  ],
};

// ─── constants ────────────────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ALL_SEMESTERS = [
  { label: "1st", value: "I"    },
  { label: "2nd", value: "II"   },
  { label: "3rd", value: "III"  },
  { label: "4th", value: "IV"   },
  { label: "5th", value: "V"    },
  { label: "6th", value: "VI"   },
  { label: "7th", value: "VII"  },
  { label: "8th", value: "VIII" },
];

// ─── types ────────────────────────────────────────────────────────────────────
type View = "list" | "dates" | "lectures" | "lectureDetail";

interface AssignedTeacher {
  teacherId: string;
  subject: string;
  schedule: { day: string; startTime: string; endTime: string }[];
}

// ─── component ────────────────────────────────────────────────────────────────
const BsAdpClasses = () => {
  const { data: departments } = useDepartments();
  const { data } = useUsers("");
  function getDeptCode(id){
    const dept=departments.find((d)=>d._id===id);
    return dept?.code;
  }

  const { profUsers, bsAdpStudents } = useMemo(() => {
    if (!data) return { profUsers: [], bsAdpStudents: [] };
    return {
      profUsers:    data.filter((u: any) => u.role === "proff"),
      bsAdpStudents: data.filter((u: any) =>
        u.role === "student" && (u.category === "bs" || u.category === "adp")
      ),
    };
  }, [data]);

  // ── navigation
  const [expandedDept,  setExpandedDept]  = useState<string | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [view,          setView]          = useState<View>("list");
  const [selectedSection,  setSelectedSection]  = useState("");
  const [selectedDate,     setSelectedDate]     = useState("");
  const [selectedLecture,  setSelectedLecture]  = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving,      setSaving]      = useState(false);

  // ── local classes
  const [localClasses, setLocalClasses] = useState<{ name: string; teacher: string; dept: string }[]>([]);

  // ── form state
  const defaultForm = {
    section:    "",
    departmentId: "",
    session:      "",
    program:      "bs" as "bs" | "adp",   // ✅ stored as category
    semester:     "I" as string,           // ✅ stored as class (I–VIII)
  };
  const [form,             setForm]             = useState(defaultForm);
  const [classSubjects,    setClassSubjects]    = useState<string[]>([]);
  const [className,setClassName]=useState("");
  const [assignedTeachers, setAssignedTeachers] = useState<AssignedTeacher[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentSearch,    setStudentSearch]    = useState("");
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const [expandedTeacher,  setExpandedTeacher]  = useState<string | null>(null);
  const [pendingTeacher,   setPendingTeacher]   = useState<{
    teacherId: string; subject: string; days: string[]; startTime: string; endTime: string;
  } | null>(null);

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  // ── derived
  const bsAdpDepts = (departments || []).filter(
    (d: any) => d?.category === "bs_adp" || d?.category === "bs" || d?.category === "adp"
  );
  const professors = profUsers || [];

  // ✅ ADP = 4 semesters, BS = 8 semesters
  const availableSemesters = form.program === "adp"
    ? ALL_SEMESTERS.slice(0, 4)
    : ALL_SEMESTERS;

  const filteredStudents = bsAdpStudents.filter((s: any) =>
    s?.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s?.specialId?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // ── navigation helpers
  const goBack = () => {
    if (view === "lectureDetail") setView("lectures");
    else if (view === "lectures") setView("dates");
    else if (view === "dates")    setView("list");
  };

  const currentLectures = lecturesByDate[selectedDate] || [];
  const currentLecture  = currentLectures.find((l) => l.id === selectedLecture);

  // ── form helpers
  const resetForm = () => {
    setForm(defaultForm);
    setClassSubjects([]);
    setAssignedTeachers([]);
    setSelectedStudents([]);
    setStudentSearch("");
    setPendingTeacher(null);
    setExpandedTeacher(null);
    setTeacherDropdownOpen(false);
    setShowAddForm(false);
  };

  // ── validation
  const validateForm = (): boolean => {
    if (!form.section.trim()) {
  toast.error("Section is required"); return false;
}
if (!/^[A-Za-z]{2}\d{1}$/.test(form.section.trim())) {
  toast.error("Section must be 2 letters followed by 1 number (e.g. CS1, PH2)"); return false;
}
    if (!form.departmentId)       { toast.error("Department is required");        return false; }
    if (!form.session.trim())     { toast.error("Session is required");           return false; }
    if (!form.program)            { toast.error("Program is required");           return false; }
    if (!form.semester)           { toast.error("Semester is required");          return false; }
    if (assignedTeachers.length === 0) { toast.error("At least one teacher must be assigned"); return false; }
   for (const t of assignedTeachers) {
  if (!t.subject) {
    toast.error("Each teacher must have a subject"); return false;
  }
  if (t.schedule.length === 0) {                          // ✅ was t.days.length
    toast.error("Each teacher must have at least one day"); return false;
  }
  if (t.schedule.some(s => !s.startTime || !s.endTime)) { // ✅ was flat t.startTime/t.endTime
    toast.error("Each teacher must have start and end time"); return false;
  }
}
    return true;
  };

  // ── submit
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSaving(true);

    const payload = {
      departmentId:  form.departmentId,
      session:       form.session.trim(),
      category:      form.program,    // ✅ "bs" or "adp" → stored as category
      class:         form.semester,
      section:form.section,
      className:`${form.program.toUpperCase()}-${getDeptCode(form.departmentId)}-${form.session.slice(2,4)}${form.session.slice(-2)}-${form.section}-${form.semester}`,   // ✅ "I"–"VIII"   → stored as class
      assignes:      assignedTeachers,
      classStudents: selectedStudents,
      subjects:      classSubjects,
    };

    setClassName(payload.className);
    console.log(payload)

    try {
      const res = await ClassService.createClass(payload);

      if (res?.error || res?.statusCode >= 400) {
        if (Array.isArray(res?.errors)) res.errors.forEach((e: string) => toast.error(e));
        else toast.error(res?.message ?? "Something went wrong");
        return;
      }

      toast.success(res?.message ?? "Class created successfully");
      setLocalClasses((prev) => [...prev, {
        name:    className,
        teacher: assignedTeachers[0]
          ? (professors.find((p: any) => p._id === assignedTeachers[0].teacherId) as any)?.name ?? "—"
          : "—",
        dept: form.departmentId,
      }]);
      resetForm();

    } catch (err: any) {
      const d = err?.response?.data;
      if (Array.isArray(d?.errors))       d.errors.forEach((m: string) => toast.error(m));
      else if (Array.isArray(d?.message)) d.message.forEach((m: string) => toast.error(m));
      else toast.error(d?.message ?? "Network error, please try again");
    } finally {
      setSaving(false);
    }
  };

  // ── teacher helpers
  const openTeacherConfig = (teacherId: string) => {
    setPendingTeacher({ teacherId, subject: "", days: [], startTime: "", endTime: "" });
    setExpandedTeacher(teacherId);
  };

  const confirmTeacher = () => {
  if (!pendingTeacher) return;
  if (!pendingTeacher.subject)            { toast.error("Please select a subject");               return; }
  if (pendingTeacher.days.length === 0)   { toast.error("Please select at least one day");        return; }
  if (!pendingTeacher.startTime || !pendingTeacher.endTime) {
    toast.error("Please set start and end time"); return;
  }

  // ✅ Build schedule array — one entry per day, same time for all
  const schedule = pendingTeacher.days.map((day) => ({
    day,
    startTime: pendingTeacher.startTime,
    endTime:   pendingTeacher.endTime,
  }));

  const assignee: AssignedTeacher = {
    teacherId: pendingTeacher.teacherId,
    subject:   pendingTeacher.subject,
    schedule,
  };

  setAssignedTeachers((prev) => {
    const exists = prev.find((t) => t.teacherId === assignee.teacherId);
    if (exists) return prev.map((t) => t.teacherId === assignee.teacherId ? assignee : t);
    return [...prev, assignee];
  });

  setClassSubjects((prev) =>
    prev.includes(pendingTeacher.subject) ? prev : [...prev, pendingTeacher.subject]
  );

  setPendingTeacher(null);
  setExpandedTeacher(null);
};

  const removeTeacher = (teacherId: string) => {
    const removed = assignedTeachers.find((t) => t.teacherId === teacherId);
    setAssignedTeachers((prev) => {
      const updated = prev.filter((t) => t.teacherId !== teacherId);
      if (removed) {
        const stillUsed = updated.some((t) => t.subject === removed.subject);
        if (!stillUsed) setClassSubjects((s) => s.filter((sub) => sub !== removed.subject));
      }
      return updated;
    });
    if (pendingTeacher?.teacherId === teacherId) setPendingTeacher(null);
  };

  // ════════════════════════════════════════════════════════════
  //  VIEWS
  // ════════════════════════════════════════════════════════════

  if (view === "lectureDetail" && currentLecture) {
    return (
      <div>
        <button onClick={goBack} className="mb-4 flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to Lectures
        </button>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-1 font-display text-xl font-bold text-foreground sm:text-2xl">
          {currentLecture.subject}
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-primary" />
            </div>
            {currentLecture.teacher}
          </span>
          <span>Total Students: {bsAdpStudents.length}</span>
        </motion.div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {["S.No", "Student ID", "Name", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-display font-semibold text-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bsAdpStudents.slice(0, 8).map((st: any, i: number) => (
                <motion.tr key={st._id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{st.specialId}</td>
                  <td className="px-4 py-3 text-foreground">{st.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${i % 3 === 0 ? "bg-destructive/10 text-destructive" : "bg-green-100 text-green-700"}`}>
                      {i % 3 === 0 ? "Absent" : "Present"}
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
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-1 font-display text-xl font-bold text-foreground sm:text-2xl">
          Lectures — {dateObj?.day}, {selectedDate}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="mb-6 text-sm text-muted-foreground">
          {selectedSection} · {currentLectures.length} lectures
        </motion.p>
        <div className="space-y-3">
          {currentLectures.map((lec, i) => (
            <motion.div key={lec.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { setSelectedLecture(lec.id); setView("lectureDetail"); }}
              className="group cursor-pointer rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all">
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
          <ChevronLeft className="h-4 w-4" /> Back to Departments
        </button>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-1 font-display text-xl font-bold text-foreground sm:text-2xl">
          {selectedSection}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="mb-6 text-sm text-muted-foreground">Schedule & Attendance</motion.p>
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {["Date", "Day", "Lectures", "Action"].map((h) => (
                  <th key={h} className={`px-4 py-3 font-display font-semibold text-foreground ${h === "Action" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classDates.map((d, i) => (
                <motion.tr key={d.date} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => { setSelectedDate(d.date); setView("lectures"); }}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
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

  // ══ MAIN LIST VIEW ═══════════════════════════════════════════
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-xl font-bold text-foreground sm:text-2xl">
          BS / ADP Departments & Classes
        </motion.h1>
        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Class
        </motion.button>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="mb-6 text-sm text-muted-foreground">
        Total Departments: {departmentData.length}
      </motion.p>

      <div className="space-y-3">
        {departmentData.map((dept, i) => (
          <motion.div key={dept.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <button
              onClick={() => { setExpandedDept(expandedDept === dept.name ? null : dept.name); setExpandedClass(null); }}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors">
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
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="border-t border-border px-4 py-3 space-y-2">
                    {dept.classes.map((cls) => {
                      const classKey = `${dept.name}-${cls.name}`;
                      return (
                        <div key={cls.name} className="rounded-lg border border-border overflow-hidden">
                          <button
                            onClick={() => setExpandedClass(expandedClass === classKey ? null : classKey)}
                            className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-secondary/30 transition-colors">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground">{cls.name}</span>
                              <span className="text-xs text-muted-foreground">({cls.sections.length} sections)</span>
                            </div>
                            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expandedClass === classKey ? "rotate-90" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {expandedClass === classKey && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="border-t border-border px-4 py-2 space-y-1.5">
                                  {cls.sections.map((sec) => (
                                    <div key={sec}
                                      onClick={() => { setSelectedSection(`${dept.name} — ${cls.name} — ${sec}`); setView("dates"); }}
                                      className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2 text-sm text-foreground cursor-pointer hover:bg-secondary transition-colors">
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

      {/* ══ ADD CLASS MODAL ══════════════════════════════════════ */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={resetForm}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="flex flex-col w-full max-w-lg rounded-2xl border border-border bg-card shadow-modal max-h-[90vh]">

              {/* header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border shrink-0">
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">Add BS / ADP Class</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Program: <span className="font-medium text-primary uppercase">{form.program}</span>
                    {" · "}Semester: <span className="font-medium text-primary">
                      {ALL_SEMESTERS.find(s => s.value === form.semester)?.label ?? form.semester}
                    </span>
                  </p>
                </div>
                <button onClick={resetForm} className="rounded-lg p-1 hover:bg-secondary transition-colors">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* scrollable body */}
              <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">

                {/* Class Name */}
                <div>
    <label className="mb-1 block text-xs font-medium text-muted-foreground">
      Section
      <span className="ml-1 text-muted-foreground/60">(e.g. CS1)</span>
    </label>
    <input
      value={form.section}
      onChange={(e) => {
        // ✅ Only allow 2 letters + 1 digit, max 3 chars
        const val = e.target.value.toUpperCase();
        if (val.length <= 3) setForm((f) => ({ ...f, section: val }));
      }}
      placeholder="CS1"
      maxLength={3}
      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    />
  </div>

                {/* Department */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
                  <select value={form.departmentId} onChange={set("departmentId")}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select department</option>
                    {bsAdpDepts?.map((d: any) => (
                      <option key={d?._id} value={d?._id}>{d?.code}</option>
                    ))}
                  </select>
                </div>

                {/* Session */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Session</label>
                  <input value={form.session} onChange={set("session")}
                    placeholder="2022-2026"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                {/* Program + Semester row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* ✅ Program — sets category (bs/adp), resets semester if needed */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Program</label>
                    <select
                      value={form.program}
                      onChange={(e) => {
                        const newProgram = e.target.value as "bs" | "adp";
                        const adpValues  = ALL_SEMESTERS.slice(0, 4).map((s) => s.value);
                        setForm((f) => ({
                          ...f,
                          program:  newProgram,
                          // ✅ reset semester if switching to ADP and current > 4th
                          semester: newProgram === "adp" && !adpValues.includes(f.semester) ? "I" : f.semester,
                        }));
                      }}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="bs">BS</option>
                      <option value="adp">ADP</option>
                    </select>
                  </div>

                  {/* ✅ Semester — value is I–VIII (stored as class in DB) */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Semester
                      <span className="ml-1 text-muted-foreground/60">
                        ({form.program === "adp" ? "4" : "8"} available)
                      </span>
                    </label>
                    <select value={form.semester} onChange={set("semester")}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      {availableSemesters.map((s) => (
                        <option key={s.value} value={s.value}>{s.label} Semester</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subjects — auto-populated from teachers */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Subjects
                    <span className="ml-1 text-muted-foreground/60">(auto-added from assigned teachers)</span>
                  </label>
                  <div className="min-h-[40px] flex flex-wrap gap-2 rounded-lg border border-input bg-background px-3 py-2">
                    {classSubjects.length === 0 && (
                      <span className="text-xs text-muted-foreground">Subjects will appear as you assign teachers</span>
                    )}
                    {classSubjects.map((sub) => (
                      <span key={sub}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {sub}
                        <button onClick={() => setClassSubjects((prev) => prev.filter((s) => s !== sub))}
                          className="ml-0.5 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input id="extra-subject-input"
                      placeholder="Add extra subject manually..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val && !classSubjects.includes(val)) setClassSubjects((p) => [...p, val]);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <button
                      onClick={() => {
                        const input = document.getElementById("extra-subject-input") as HTMLInputElement;
                        const val = input?.value.trim();
                        if (val && !classSubjects.includes(val)) { setClassSubjects((p) => [...p, val]); input.value = ""; }
                      }}
                      className="rounded-lg border border-input px-3 py-1.5 text-sm hover:bg-secondary transition-colors">
                      Add
                    </button>
                  </div>
                </div>

                {/* Assign Teachers */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Assign Teachers
                    {assignedTeachers.length > 0 && (
                      <span className="ml-1 text-primary">({assignedTeachers.length} assigned)</span>
                    )}
                  </label>

                  {assignedTeachers.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                     {assignedTeachers.map((t) => {
  const prof = professors.find((p: any) => p._id === t.teacherId) as any;
  return (
    <span key={t.teacherId}
      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      {prof?.name ?? "Teacher"} · {t.subject} ·{" "}
      {/* ✅ display each schedule entry */}
      {t.schedule.map((s) => `${s.day} ${s.startTime}–${s.endTime}`).join(", ")}
      <button onClick={() => removeTeacher(t.teacherId)} className="ml-1 hover:text-destructive">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
})}
                    </div>
                  )}

                  <button onClick={() => setTeacherDropdownOpen(!teacherDropdownOpen)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-left text-muted-foreground hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors">
                    + Select a teacher to assign
                  </button>

                  <AnimatePresence>
                    {teacherDropdownOpen && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-1 rounded-lg border border-border bg-card shadow-elevated max-h-72 overflow-y-auto">
                        {professors.length === 0 && (
                          <p className="p-4 text-center text-sm text-muted-foreground">No professors loaded</p>
                        )}
                        {professors.map((p: any) => {
                          const alreadyAssigned = assignedTeachers.some((t) => t.teacherId === p._id);
                          const isExpanded      = expandedTeacher === p._id;
                          const isPending       = pendingTeacher?.teacherId === p._id;

                          return (
                            <div key={p._id} className="border-b border-border last:border-0">
                              <button
                                onClick={() => {
                                  if (alreadyAssigned) { removeTeacher(p._id); return; }
                                  if (isExpanded) { setExpandedTeacher(null); setPendingTeacher(null); return; }
                                  openTeacherConfig(p._id);
                                  setTeacherDropdownOpen(true);
                                }}
                                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-secondary/50 transition-colors">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <UserCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{p.name} {p.lastName}</p>
                                  <p className="text-xs text-muted-foreground">{p.department?.code ?? "—"}</p>
                                </div>
                                {alreadyAssigned
                                  ? <span className="text-xs text-primary flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Assigned</span>
                                  : <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                }
                              </button>

                              <AnimatePresence>
                                {isExpanded && isPending && !alreadyAssigned && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-secondary/20 px-4 py-3 space-y-2">

                                    {/* Subject */}
                                    <div>
                                      <label className="mb-1 block text-xs text-muted-foreground">Subject</label>
                                      {p.subjects?.length > 0 ? (
                                        <select value={pendingTeacher?.subject}
                                          onChange={(e) => setPendingTeacher((pt) => pt ? { ...pt, subject: e.target.value } : pt)}
                                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                          <option value="">Select subject</option>
                                          {p.subjects.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                      ) : (
                                        <input value={pendingTeacher?.subject}
                                          onChange={(e) => setPendingTeacher((pt) => pt ? { ...pt, subject: e.target.value } : pt)}
                                          placeholder="e.g. Data Structures"
                                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                                      )}
                                    </div>

                                    {/* Days — multi-select pills */}
                                    <div>
                                      <label className="mb-1 block text-xs text-muted-foreground">
                                        Days (Select days where the lecture time is same)
                                        {pendingTeacher?.days && pendingTeacher.days.length > 0 && (
                                          <span className="ml-1 text-primary">({pendingTeacher.days.length} selected)</span>
                                        )}
                                      </label>
                                      <div className="flex flex-wrap gap-2">
                                        {DAYS.map((d) => {
                                          const isSelected = pendingTeacher?.days.includes(d) ?? false;
                                          return (
                                            <button key={d} type="button"
                                              onClick={() => setPendingTeacher((pt) => pt
                                                ? { ...pt, days: isSelected ? pt.days.filter((day) => day !== d) : [...pt.days, d] }
                                                : pt
                                              )}
                                              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                                                isSelected
                                                  ? "bg-primary text-primary-foreground border-primary"
                                                  : "bg-background text-muted-foreground border-input hover:bg-secondary"
                                              }`}>
                                              {d.slice(0, 3)}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Time */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="mb-1 block text-xs text-muted-foreground">Start time</label>
                                        <input type="time" value={pendingTeacher?.startTime}
                                          onChange={(e) => setPendingTeacher((pt) => pt ? { ...pt, startTime: e.target.value } : pt)}
                                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                                      </div>
                                      <div>
                                        <label className="mb-1 block text-xs text-muted-foreground">End time</label>
                                        <input type="time" value={pendingTeacher?.endTime}
                                          onChange={(e) => setPendingTeacher((pt) => pt ? { ...pt, endTime: e.target.value } : pt)}
                                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                                      </div>
                                    </div>

                                    <button onClick={confirmTeacher}
                                      className="w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                      Confirm Assignment
                                    </button>
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

                {/* Add Students */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Add Students
                    {selectedStudents.length > 0 && (
                      <span className="ml-1 text-primary">({selectedStudents.length} selected)</span>
                    )}
                  </label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Search by name or ID..."
                      className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="max-h-44 overflow-y-auto rounded-lg border border-border">
                    {filteredStudents.length === 0 && (
                      <p className="p-4 text-center text-sm text-muted-foreground">No students found</p>
                    )}
                    {filteredStudents.map((s: any) => (
                      <button key={s._id}
                        onClick={() => setSelectedStudents((prev) =>
                          prev.includes(s._id) ? prev.filter((id) => id !== s._id) : [...prev, s._id]
                        )}
                        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-secondary/50 transition-colors border-b border-border last:border-0">
                        <div>
                          <p className="text-sm text-foreground">{s.name} {s.lastName}</p>
                          <p className="text-xs text-muted-foreground">{s.specialId}</p>
                        </div>
                        {selectedStudents.includes(s._id) && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

              </div>{/* end scrollable */}

              {/* footer */}
              <div className="flex gap-3 px-6 py-4 border-t border-border shrink-0">
                <button onClick={resetForm}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={saving}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : "Add Class"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BsAdpClasses;