import { useQuery } from "@tanstack/react-query";
import ClassService from "@/services/classService";

export const useMyClasses = () => {

  return useQuery({
    queryKey: ["myclasses"],
    queryFn: ()=>ClassService.getMyClasses(),   // 👈 prevents query if logged out
    retry: false
  });

};