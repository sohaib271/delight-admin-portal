// hooks/useTeacherSchedule.ts
import { useState, useEffect } from "react";
import UserService from "@/services/userService";

export interface ScheduleEntry {
  day:        string;
  startTime:  string;
  endTime:    string;
  subject:    string;
  className:  string;
  category:   string;
  class:      string;
  session:    string;
  department: string;
}

export const useTeacherSchedule = (teacherId: string | null | undefined) => {
  const [schedule,  setSchedule]  = useState<ScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    // ✅ Don't fetch if no valid ID
    if (!teacherId || typeof teacherId !== "string" || !teacherId.trim()) {
      setSchedule([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const load = async () => {
      try {
        const res = await UserService.getTeacherSchedule(teacherId);
        if (!cancelled) setSchedule(res?.schedule ?? []);
      } catch {
        if (!cancelled) setError("Failed to load schedule");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [teacherId]);

  return { schedule, isLoading, error };
};