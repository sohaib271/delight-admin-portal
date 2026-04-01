import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, BookOpen, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FacultyDetailViewProps {
  faculty: any;
  type: "proff" | "principal" | "vice_principal";
  onBack: () => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Mock schedule data — in production this comes from assigned classes
const getMockSchedule = (faculty: any) => {
  if (!faculty?.assignedClasses || faculty.assignedClasses.length === 0) {
    // Generate mock schedule based on subjects
    const subjects = faculty?.subjects || [];
    if (subjects.length === 0) return {};

    const schedule: Record<string, { time: string; subject: string; className: string; duration: string }[]> = {};
    const times = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];

    DAYS.slice(0, 5).forEach((day, di) => {
      const lectureCount = 2 + (di % 3);
      schedule[day] = [];
      for (let i = 0; i < lectureCount; i++) {
        schedule[day].push({
          time: times[i + (di % 2)],
          subject: subjects[i % subjects.length] || "General",
          className: `ICS-PHY-PB${di + 1}-${i % 2 === 0 ? "I" : "II"}`,
          duration: "40 mins",
        });
      }
    });
    return schedule;
  }
  return {};
};

const FacultyDetailView = ({ faculty, type, onBack }: FacultyDetailViewProps) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const isProfessor = type === "proff";
  const schedule = isProfessor ? getMockSchedule(faculty) : {};
  const hasSchedule = Object.keys(schedule).length > 0;

  const details: [string, string][] = [
    ["First Name", faculty?.name ?? "—"],
    ["Last Name", faculty?.lastName ?? "—"],
    ["Email", faculty?.email ?? "—"],
    ["Phone", faculty?.phone ?? "—"],
    ["CNIC", faculty?.cnic ?? "—"],
    ["Gender", faculty?.gender === "M" ? "Male" : faculty?.gender === "F" ? "Female" : "—"],
    ["City", faculty?.city ?? "—"],
    ["Address", faculty?.address ?? "—"],
    ["Date of Joining", faculty?.doj ?? "—"],
    ...(isProfessor
      ? [
          ["HOD", faculty?.isHod ? "Yes" : "No"] as [string, string],
          ["Department", faculty?.department?.code ?? faculty?.department ?? "—"] as [string, string],
          ["Qualification", faculty?.qualification ?? "—"] as [string, string],
          ["Subjects", Array.isArray(faculty?.subjects) ? faculty.subjects.join(", ") : (faculty?.subjects ?? "—")] as [string, string],
        ]
      : []),
  ];

  if (showSchedule && isProfessor) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Button variant="ghost" size="sm" onClick={() => setShowSchedule(false)} className="gap-1.5 w-fit">
            <ArrowLeft className="h-4 w-4" /> Back to Details
          </Button>
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
            {faculty?.name} {faculty?.lastName}'s Schedule
          </h2>
        </div>

        {!hasSchedule ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 sm:p-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">No Schedule Available</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              This professor is not currently assigned to any class. Assign them to a class to generate their schedule.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {DAYS.map((day) => {
              const lectures = schedule[day];
              if (!lectures || lectures.length === 0) return (
                <motion.div key={day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-card p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-sm sm:text-base font-semibold text-foreground">{day}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground pl-6">No lectures scheduled</p>
                </motion.div>
              );

              return (
                <motion.div key={day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-3 border-b border-border bg-secondary/30">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-sm sm:text-base font-semibold text-foreground">{day}</h3>
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {lectures.length} lecture{lectures.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {lectures.map((lec, i) => (
                      <div key={i} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="font-medium text-foreground">{lec.time}</span>
                          <span className="text-muted-foreground">({lec.duration})</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm pl-5 sm:pl-0">
                          <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="text-foreground">{lec.subject}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm pl-5 sm:pl-0 sm:ml-auto">
                          <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">{lec.className}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 w-fit">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
            {type === "proff" ? "Professor" : type === "principal" ? "Principal" : "Vice Principal"} Details
          </h2>
        </div>
        {isProfessor && (
          <Button size="sm" variant="outline" onClick={() => setShowSchedule(true)} className="gap-1.5 w-fit">
            <Calendar className="h-4 w-4" /> View Schedule
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 px-4 sm:px-6 py-5 border-b border-border bg-secondary/30">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shrink-0">
            {faculty?.name?.[0]}{faculty?.lastName?.[0]}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-display text-lg font-bold text-foreground">
              {faculty?.name} {faculty?.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {type === "proff" ? "Professor" : type === "principal" ? "Principal" : "Vice Principal"}
              {isProfessor && faculty?.department?.code ? ` — ${faculty.department.code}` : ""}
            </p>
            {isProfessor && (
              <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                faculty?.isHod ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {faculty?.isHod ? "Head of Department" : "Faculty Member"}
              </span>
            )}
          </div>
        </div>

        {/* Details grid */}
        <div className="p-4 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between sm:flex-col gap-1 border-b border-border pb-3 last:border-0 sm:border-0 sm:pb-0">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-foreground text-right sm:text-left">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FacultyDetailView;
