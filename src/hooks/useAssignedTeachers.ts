import { useQuery } from "@tanstack/react-query";
import ClassService from "@/services/classService";

export const useAssignedTeachers = (classId?:string) => {

  return useQuery({
    queryKey: ["assignedTeachers"],
    queryFn: ()=>ClassService.getAssignedTeachers(classId),   // 👈 prevents query if logged out
    retry: false
  });

};