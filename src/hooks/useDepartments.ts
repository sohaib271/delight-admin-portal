import DepartmentService from "@/services/departmentService";
import { useQuery } from "@tanstack/react-query";


export const useDepartments = () => {

  return useQuery({
    queryKey: ["departments"],
    queryFn: ()=>DepartmentService.getAllDepartments(),
    retry: false
  });

};