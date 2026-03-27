import { useQuery } from "@tanstack/react-query";
import UserService from "@/services/userService";

export const useCurrentUser = (enabled:boolean) => {

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: UserService.getCurrentUser,
    enabled,
    retry:false
  });

};