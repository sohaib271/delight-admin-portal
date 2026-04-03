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

export const useTeacherSchedule = (teacherId: string | null) => {
  const [schedule,  setSchedule]  = useState<ScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId) return;
    let cancelled = false;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await UserService.getTeacherSchedule(teacherId);
        if (!cancelled) setSchedule(res?.schedule ?? []);
      } catch {
        if (!cancelled) setError("Failed to load schedule");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [teacherId]);

  return { schedule, isLoading, error };
};