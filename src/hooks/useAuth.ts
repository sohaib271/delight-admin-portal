// hooks/useAuth.ts
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useAuth = () => {
  const { user, token } = useSelector((state: RootState) => state.user);

  return {
    user,
    token,
    isAuthenticated: !!token,
  };
};