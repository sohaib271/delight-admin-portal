// hooks/useClassForm.ts
import { useState, useMemo } from "react";
import { toast } from "sonner";
import ClassService from "@/services/classService";

export interface AssignedTeacher {
  teacherId: string;
  subject: string;
  schedule: { day: string; startTime: string; endTime: string }[];
}

interface UseClassFormOptions {
  category: string;
  getDeptCode: (id: string) => string;
  programPrefix?: string; // "BS" / "ADP" for bs_adp, undefined for intermediate
}

export function useClassForm({ category, getDeptCode, programPrefix }: UseClassFormOptions) {
  const defaultForm = {
    departmentId: "",
    session:      "",
    section:      "",
    class:        "I" as string,
    ...(programPrefix !== undefined && { program: "bs" as "bs" | "adp", semester: "I" }),
  };

  const [form,             setForm]             = useState<any>(defaultForm);
  const [classSubjects,    setClassSubjects]    = useState<string[]>([]);
  const [assignedTeachers, setAssignedTeachers] = useState<AssignedTeacher[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentSearch,    setStudentSearch]    = useState("");
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const [expandedTeacher,  setExpandedTeacher]  = useState<string | null>(null);
  const [saving,           setSaving]           = useState(false);
  const [pendingTeacher,   setPendingTeacher]   = useState<{
    teacherId: string; subject: string; days: string[]; startTime: string; endTime: string;
  } | null>(null);

  const set = (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f: any) => ({ ...f, [key]: e.target.value }));

  // Generated class name
  const generatedClassName = useMemo(() => {
    const deptCode    = form.departmentId ? getDeptCode(form.departmentId) : "";
    const sessionCode = form.session?.length >= 7
      ? `${form.session.slice(2, 4)}${form.session.slice(-2)}`
      : form.session;
    const section  = form.section?.trim().toUpperCase();
    const part     = form.semester ?? form.class;
    const prefix   = form.program ? `${form.program.toUpperCase()}-` : "";

    if (!form.departmentId || !form.session || !section) return "";
    return `${prefix}${deptCode}-${sessionCode}-${section}-${part}`;
  }, [form, getDeptCode]);

  const resetForm = (closeModal: () => void) => {
    setForm(defaultForm);
    setClassSubjects([]);
    setAssignedTeachers([]);
    setSelectedStudents([]);
    setStudentSearch("");
    setPendingTeacher(null);
    setExpandedTeacher(null);
    setTeacherDropdownOpen(false);
    closeModal();
  };

  const validateForm = (): boolean => {
    if (!form.section?.trim())                         { toast.error("Section is required"); return false; }
    if (!/^[A-Za-z]{2}\d$/.test(form.section.trim())) { toast.error("Section: 2 letters + 1 number (e.g. CS1)"); return false; }
    if (!form.departmentId)                            { toast.error("Department is required"); return false; }
    if (!form.session?.trim())                         { toast.error("Session is required"); return false; }
    if (assignedTeachers.length === 0)                 { toast.error("At least one teacher must be assigned"); return false; }
    for (const t of assignedTeachers) {
      if (!t.subject)              { toast.error("Each teacher must have a subject");         return false; }
      if (t.schedule.length === 0) { toast.error("Each teacher must have at least one day"); return false; }
      if (t.schedule.some(s => !s.startTime || !s.endTime)) {
        toast.error("Each teacher must have start and end time"); return false;
      }
    }
    return true;
  };

  const handleSubmit = async (onSuccess: () => void) => {
    if (!validateForm()) return;
    setSaving(true);

    const payload = {
      className:     generatedClassName,
      departmentId:  form.departmentId,
      session:       form.session.trim(),
      category:      form.program ?? category,
      class:         form.semester ?? form.class,
      section:       form.section.toUpperCase(),
      assignes:      assignedTeachers,
      classStudents: selectedStudents,
      subjects:      classSubjects,
    };

    try {
      const res = await ClassService.createClass(payload);
      if (res?.error || res?.statusCode >= 400) {
        if (Array.isArray(res?.errors)) res.errors.forEach((e: string) => toast.error(e));
        else toast.error(res?.message ?? "Something went wrong");
        return;
      }
      toast.success(res?.message ?? "Class created successfully");
      onSuccess();
    } catch (err: any) {
      const d = err?.response?.data;
      if (Array.isArray(d?.errors))       d.errors.forEach((m: string) => toast.error(m));
      else if (Array.isArray(d?.message)) d.message.forEach((m: string) => toast.error(m));
      else toast.error(d?.message ?? "Network error, please try again");
    } finally {
      setSaving(false);
    }
  };

  const openTeacherConfig = (teacherId: string) => {
    setPendingTeacher({ teacherId, subject: "", days: [], startTime: "", endTime: "" });
    setExpandedTeacher(teacherId);
  };

  const confirmTeacher = () => {
    if (!pendingTeacher) return;
    if (!pendingTeacher.subject)          { toast.error("Please select a subject");        return; }
    if (pendingTeacher.days.length === 0) { toast.error("Please select at least one day"); return; }
    if (!pendingTeacher.startTime || !pendingTeacher.endTime) {
      toast.error("Please set start and end time"); return;
    }
    const schedule = pendingTeacher.days.map((day) => ({
      day, startTime: pendingTeacher.startTime, endTime: pendingTeacher.endTime,
    }));
    const assignee: AssignedTeacher = { teacherId: pendingTeacher.teacherId, subject: pendingTeacher.subject, schedule };
    setAssignedTeachers((prev) => {
      const exists = prev.find((t) => t.teacherId === assignee.teacherId);
      if (exists) return prev.map((t) => t.teacherId === assignee.teacherId ? assignee : t);
      return [...prev, assignee];
    });
    setClassSubjects((prev) => prev.includes(pendingTeacher.subject) ? prev : [...prev, pendingTeacher.subject]);
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

  return {
    form, set, setForm,
    classSubjects, setClassSubjects,
    assignedTeachers,
    selectedStudents, setSelectedStudents,
    studentSearch, setStudentSearch,
    teacherDropdownOpen, setTeacherDropdownOpen,
    expandedTeacher, setExpandedTeacher,
    pendingTeacher, setPendingTeacher,
    saving,
    generatedClassName,
    resetForm, validateForm, handleSubmit,
    openTeacherConfig, confirmTeacher, removeTeacher,
  };
}