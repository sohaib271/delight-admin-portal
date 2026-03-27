import { useQuery } from "@tanstack/react-query";
import UserService from "@/services/userService";

export const useUsers = (role?:string) => {

  return useQuery({
    queryKey: ["users",role],
    queryFn: ()=>UserService.getUsers(role),   // 👈 prevents query if logged out
    retry: false,
  });

};