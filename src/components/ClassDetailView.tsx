import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronDown, Plus, Search, Check, X,
  UserCircle, BookOpen, Clock, Trash2, Edit3, Users, GraduationCap, Calendar,
} from "lucide-react";
import { toast } from "sonner";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface AssignedTeacher {
  teacherId: string;
  subject: string;
  schedule: { day: string; startTime: string; endTime: string }[];
}

interface ClassDetailViewProps {
  classData: any;
  professors: any[];
  students: any[];
  onBack: () => void;
  onViewSchedule: () => void;
  onRemoveTeacher?: (teacherId: string) => void;
  onRemoveStudent?: (studentId: string) => void;
  onAddTeachers?: (teachers: AssignedTeacher[]) => void;
  onAddStudents?: (studentIds: string[]) => void;
  onUpdateTeacherSchedule?: (teacherId: string, schedule: { day: string; startTime: string; endTime: string }[]) => void;
}

const ClassDetailView = ({
  classData,
  professors,
  students,
  onBack,
  onViewSchedule,
  onRemoveTeacher,
  onRemoveStudent,
  onAddTeachers,
  onAddStudents,
  onUpdateTeacherSchedule,
}: ClassDetailViewProps) => {
  const [activeTab, setActiveTab] = useState<"teachers" | "students">("teachers");
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedNewStudents, setSelectedNewStudents] = useState<string[]>([]);

  // Teacher assignment state
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);
  const [pendingTeacher, setPendingTeacher] = useState<{
    teacherId: string; subject: string; days: string[]; startTime: string; endTime: string;
  } | null>(null);
  const [newAssignedTeachers, setNewAssignedTeachers] = useState<AssignedTeacher[]>([]);

  // Schedule editing state
  const [editSchedule, setEditSchedule] = useState<{ day: string; startTime: string; endTime: string }[]>([]);

  const assignedTeacherIds = (classData?.assignes || []).map((a: any) => a.teacherId?._id || a.teacherId);
  const assignedStudentIds = (classData?.classStudents || []).map((s: any) => s?._id || s);

  const unassignedProfessors = professors.filter(
    (p: any) => !assignedTeacherIds.includes(p._id) && !newAssignedTeachers.some(t => t.teacherId === p._id)
  );

  const unassignedStudents = students.filter(
    (s: any) => !assignedStudentIds.includes(s._id) && !selectedNewStudents.includes(s._id)
  );

  const filteredUnassignedStudents = unassignedStudents.filter((s: any) =>
    s?.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s?.specialId?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const openTeacherConfig = (teacherId: string) => {
    setPendingTeacher({ teacherId, subject: "", days: [], startTime: "", endTime: "" });
    setExpandedTeacher(teacherId);
  };

  const confirmNewTeacher = () => {
    if (!pendingTeacher) return;
    if (!pendingTeacher.subject) { toast.error("Please select a subject"); return; }
    if (pendingTeacher.days.length === 0) { toast.error("Please select at least one day"); return; }
    if (!pendingTeacher.startTime || !pendingTeacher.endTime) { toast.error("Please set start and end time"); return; }
    const schedule = pendingTeacher.days.map(day => ({
      day, startTime: pendingTeacher.startTime, endTime: pendingTeacher.endTime,
    }));
    setNewAssignedTeachers(prev => [...prev, {
      teacherId: pendingTeacher.teacherId, subject: pendingTeacher.subject, schedule,
    }]);
    setPendingTeacher(null);
    setExpandedTeacher(null);
  };

  const handleSaveNewTeachers = () => {
    if (newAssignedTeachers.length === 0) { toast.error("No new teachers to add"); return; }
    onAddTeachers?.(newAssignedTeachers);
    setNewAssignedTeachers([]);
    setShowAddTeacher(false);
    toast.success(`${newAssignedTeachers.length} teacher(s) assigned`);
  };

  const handleSaveNewStudents = () => {
    if (selectedNewStudents.length === 0) { toast.error("No new students to add"); return; }
    onAddStudents?.(selectedNewStudents);
    setSelectedNewStudents([]);
    setShowAddStudent(false);
    toast.success(`${selectedNewStudents.length} student(s) added`);
  };

  const startEditSchedule = (teacherId: string, currentSchedule: any[]) => {
    setEditingSchedule(teacherId);
    setEditSchedule(currentSchedule.map(s => ({ ...s })));
  };

  const saveScheduleEdit = () => {
    if (!editingSchedule) return;
    if (editSchedule.length === 0) { toast.error("Schedule must have at least one entry"); return; }
    if (editSchedule.some(s => !s.startTime || !s.endTime)) { toast.error("All entries need times"); return; }
    onUpdateTeacherSchedule?.(editingSchedule, editSchedule);
    setEditingSchedule(null);
    setEditSchedule([]);
    toast.success("Schedule updated");
  };

  const tabs = [
    { key: "teachers" as const, label: "Teachers", icon: GraduationCap, count: assignedTeacherIds.length },
    { key: "students" as const, label: "Students", icon: Users, count: assignedStudentIds.length },
  ];

  return (
    <div>
      <button onClick={onBack} className="mb-4 flex items-center gap-1 text-sm text-primary hover:underline">
        <ChevronLeft className="h-4 w-4" /> Back to Classes
      </button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">{classData?.className}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {classData?.session} · {assignedTeacherIds.length} teachers · {assignedStudentIds.length} students
            </p>
          </div>
          <button
            onClick={onViewSchedule}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <Calendar className="h-4 w-4" /> View Schedule
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 rounded-lg bg-secondary/50 p-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === tab.key ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Teachers Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "teachers" && (
          <motion.div key="teachers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Assigned Teachers</h3>
              <button
                onClick={() => setShowAddTeacher(true)}
                className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Assign Teacher
              </button>
            </div>

            <div className="space-y-2">
              {(classData?.assignes || []).length === 0 && (
                <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                  No teachers assigned yet
                </div>
              )}
              {(classData?.assignes || []).map((assignee: any, i: number) => {
                const teacher = assignee.teacherId && typeof assignee.teacherId === "object"
                  ? assignee.teacherId
                  : professors.find((p: any) => p._id === (assignee.teacherId?._id || assignee.teacherId));
                const isEditing = editingSchedule === (teacher?._id || assignee.teacherId);

                return (
                  <motion.div
                    key={teacher?._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-border bg-card p-4 shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <UserCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{teacher?.name || "Unknown"} {teacher?.lastName || ""}</p>
                          <p className="text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary font-medium">
                              <BookOpen className="h-3 w-3" /> {assignee.subject}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEditSchedule(teacher?._id || assignee.teacherId, assignee.schedule || [])}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                          title="Edit Schedule"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Remove this teacher from the if class?")) {
                              onRemoveTeacher?.(teacher?._id || assignee.teacherId);
                            }
                          }}
                          className="rounded-lg    p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          title="Remove Teacher"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Schedule display or edit */}
                    {isEditing ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2 border-t border-border pt-3">
                        <label className="text-xs font-medium text-muted-foreground">Edit Schedule</label>
                        {editSchedule.map((s, si) => (
                          <div key={si} className="flex items-center gap-2">
                            <select
                              value={s.day}
                              onChange={(e) => setEditSchedule(prev => prev.map((x, xi) => xi === si ? { ...x, day: e.target.value } : x))}
                              className="rounded-md border border-input bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              {DAYS.map(d => <option key={d} value={d}>{d.slice(0, 3)}</option>)}
                            </select>
                            <input type="time" value={s.startTime}
                              onChange={(e) => setEditSchedule(prev => prev.map((x, xi) => xi === si ? { ...x, startTime: e.target.value } : x))}
                              className="rounded-md border border-input bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
                            <input type="time" value={s.endTime}
                              onChange={(e) => setEditSchedule(prev => prev.map((x, xi) => xi === si ? { ...x, endTime: e.target.value } : x))}
                              className="rounded-md border border-input bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
                            <button onClick={() => setEditSchedule(prev => prev.filter((_, xi) => xi !== si))}
                              className="text-destructive hover:text-destructive/80"><X className="h-4 w-4" /></button>
                          </div>
                        ))}
                        <button onClick={() => setEditSchedule(prev => [...prev, { day: "Monday", startTime: "", endTime: "" }])}
                          className="text-xs text-primary hover:underline flex items-center gap-1">
                          <Plus className="h-3 w-3" /> Add Day
                        </button>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingSchedule(null); setEditSchedule([]); }}
                            className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary transition-colors">Cancel</button>
                          <button onClick={saveScheduleEdit}
                            className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 transition-colors">Save</button>
                        </div>
                      </motion.div>
                    ) : (
                      assignee.schedule && assignee.schedule.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {assignee.schedule.map((s: any, si: number) => (
                            <span key={si} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" /> {s.day?.slice(0, 3)} {s.startTime}–{s.endTime}
                            </span>
                          ))}
                        </div>
                      )
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Add Teacher Modal */}
            <AnimatePresence>
              {showAddTeacher && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                  onClick={() => { setShowAddTeacher(false); setNewAssignedTeachers([]); setPendingTeacher(null); setExpandedTeacher(null); }}>
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()}
                    className="flex flex-col w-full max-w-lg rounded-2xl border border-border bg-card shadow-modal max-h-[80vh]">
                    <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border shrink-0">
                      <h2 className="font-display text-base font-bold text-foreground">Assign New Teachers</h2>
                      <button onClick={() => { setShowAddTeacher(false); setNewAssignedTeachers([]); }}
                        className="rounded-lg p-1 hover:bg-secondary transition-colors">
                        <X className="h-5 w-5 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="overflow-y-auto flex-1 px-6 py-4">
                      {/* Newly assigned (pending save) */}
                      {newAssignedTeachers.length > 0 && (
                        <div className="mb-3 space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Pending ({newAssignedTeachers.length})</label>
                          {newAssignedTeachers.map(t => {
                            const prof = professors.find((p: any) => p._id === t.teacherId) as any;
                            return (
                              <div key={t.teacherId} className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2">
                                <div>
                                  <p className="text-sm font-medium text-foreground">{prof?.name} {prof?.lastName}</p>
                                  <p className="text-xs text-muted-foreground">{t.subject} · {t.schedule.map(s => s.day.slice(0, 3)).join(", ")}</p>
                                </div>
                                <button onClick={() => setNewAssignedTeachers(prev => prev.filter(x => x.teacherId !== t.teacherId))}
                                  className="text-destructive hover:text-destructive/80"><X className="h-4 w-4" /></button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {unassignedProfessors.length === 0 && newAssignedTeachers.length === 0 && (
                        <p className="py-6 text-center text-sm text-muted-foreground">All professors are already assigned</p>
                      )}

                      {unassignedProfessors.map((p: any) => {
                        const isExpanded = expandedTeacher === p._id;
                        const isPending = pendingTeacher?.teacherId === p._id;
                        return (
                          <div key={p._id} className="border-b border-border last:border-0">
                            <button onClick={() => {
                              if (isExpanded) { setExpandedTeacher(null); setPendingTeacher(null); return; }
                              openTeacherConfig(p._id);
                            }}
                              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-secondary/50 transition-colors">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <UserCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{p.name} {p.lastName}</p>
                                <p className="text-xs text-muted-foreground">{p.department?.code ?? "—"}</p>
                              </div>
                              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                              {isExpanded && isPending && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-secondary/20 px-4 py-3 space-y-2">
                                  <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">Subject</label>
                                    {p.subjects?.length > 0 ? (
                                      <select value={pendingTeacher?.subject}
                                        onChange={e => setPendingTeacher(pt => pt ? { ...pt, subject: e.target.value } : pt)}
                                        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                        <option value="">Select subject</option>
                                        {p.subjects.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                      </select>
                                    ) : (
                                      <input value={pendingTeacher?.subject}
                                        onChange={e => setPendingTeacher(pt => pt ? { ...pt, subject: e.target.value } : pt)}
                                        placeholder="e.g. Physics"
                                        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                                    )}
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">Days</label>
                                    <div className="flex flex-wrap gap-2">
                                      {DAYS.map(d => {
                                        const sel = pendingTeacher?.days.includes(d) ?? false;
                                        return (
                                          <button key={d} type="button"
                                            onClick={() => setPendingTeacher(pt => pt ? { ...pt, days: sel ? pt.days.filter(x => x !== d) : [...pt.days, d] } : pt)}
                                            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${sel ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-input hover:bg-secondary"}`}>
                                            {d.slice(0, 3)}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="mb-1 block text-xs text-muted-foreground">Start</label>
                                      <input type="time" value={pendingTeacher?.startTime}
                                        onChange={e => setPendingTeacher(pt => pt ? { ...pt, startTime: e.target.value } : pt)}
                                        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                                    </div>
                                    <div>
                                      <label className="mb-1 block text-xs text-muted-foreground">End</label>
                                      <input type="time" value={pendingTeacher?.endTime}
                                        onChange={e => setPendingTeacher(pt => pt ? { ...pt, endTime: e.target.value } : pt)}
                                        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                                    </div>
                                  </div>
                                  <button onClick={confirmNewTeacher}
                                    className="w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                    Confirm Assignment
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-3 px-6 py-4 border-t border-border shrink-0">
                      <button onClick={() => { setShowAddTeacher(false); setNewAssignedTeachers([]); }}
                        className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
                      <button onClick={handleSaveNewTeachers} disabled={newAssignedTeachers.length === 0}
                        className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                        Save ({newAssignedTeachers.length})
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <motion.div key="students" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Enrolled Students</h3>
              <button
                onClick={() => setShowAddStudent(true)}
                className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Students
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    {["S.No", "Student ID", "Name", "Action"].map(h => (
                      <th key={h} className={`px-4 py-3 font-display font-semibold text-foreground ${h === "Action" ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(classData?.classStudents || []).length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">No students enrolled</td></tr>
                  )}
                  {(classData?.classStudents || []).map((student: any, i: number) => {
                    const st = typeof student === "object" ? student : students.find((s: any) => s._id === student);
                    return (
                      <motion.tr key={st?._id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{st?.specialId || "—"}</td>
                        <td className="px-4 py-3 text-foreground">{st?.name || "Unknown"} {st?.lastName || ""}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm("Remove this student from the class?")) {
                                onRemoveStudent?.(st?._id || student);
                              }
                            }}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Remove Student"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add Student Modal */}
            <AnimatePresence>
              {showAddStudent && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                  onClick={() => { setShowAddStudent(false); setSelectedNewStudents([]); setStudentSearch(""); }}>
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()}
                    className="flex flex-col w-full max-w-lg rounded-2xl border border-border bg-card shadow-modal max-h-[80vh]">
                    <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border shrink-0">
                      <h2 className="font-display text-base font-bold text-foreground">
                        Add Students
                        {selectedNewStudents.length > 0 && <span className="ml-2 text-primary">({selectedNewStudents.length} selected)</span>}
                      </h2>
                      <button onClick={() => { setShowAddStudent(false); setSelectedNewStudents([]); setStudentSearch(""); }}
                        className="rounded-lg p-1 hover:bg-secondary transition-colors">
                        <X className="h-5 w-5 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="px-6 pt-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
                          placeholder="Search by name or ID..."
                          className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    </div>
                    <div className="overflow-y-auto flex-1 px-6 py-3">
                      {filteredUnassignedStudents.length === 0 && (
                        <p className="py-6 text-center text-sm text-muted-foreground">No available students found</p>
                      )}
                      {filteredUnassignedStudents.map((s: any) => (
                        <button key={s._id}
                          onClick={() => setSelectedNewStudents(prev =>
                            prev.includes(s._id) ? prev.filter(id => id !== s._id) : [...prev, s._id]
                          )}
                          className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-secondary/50 transition-colors border-b border-border last:border-0">
                          <div>
                            <p className="text-sm text-foreground">{s.name} {s.lastName}</p>
                            <p className="text-xs text-muted-foreground">{s.specialId}</p>
                          </div>
                          {selectedNewStudents.includes(s._id) && <Check className="h-4 w-4 text-primary" />}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3 px-6 py-4 border-t border-border shrink-0">
                      <button onClick={() => { setShowAddStudent(false); setSelectedNewStudents([]); setStudentSearch(""); }}
                        className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
                      <button onClick={handleSaveNewStudents} disabled={selectedNewStudents.length === 0}
                        className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                        Add ({selectedNewStudents.length})
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassDetailView;
