// ProfessorDashboard.tsx
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import FacultyDetailView from "@/components/FacultyDetailView";

const ProfessorDashboard = () => {
  const user = useSelector((state: any) => state?.user.user);

  // ✅ Guard — user not yet in store (e.g. first load before persist kicks in)
  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ✅ Guard — user exists but is not a professor
  if (user.role !== "proff") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Access denied.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6"
    >
      <FacultyDetailView
        faculty={user}
        type="proff"
        onBack={() => {}}
        autoShowSchedule
      />
    </motion.div>
  );
};

export default ProfessorDashboard;