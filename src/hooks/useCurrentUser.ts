import { useQuery } from "@tanstack/react-query";
import UserService from "@/services/userService";

export const useCurrentUser = (isLoggedIn: boolean) => {

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: UserService.getCurrentUser,
    enabled: isLoggedIn,   // 👈 prevents query if logged out
    retry: false
  });

};