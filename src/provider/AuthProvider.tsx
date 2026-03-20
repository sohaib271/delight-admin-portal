import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { setUser } from "@/store/userSlice";
import { RootState } from "@/store/store";

export default function AuthProvider({ children }: any) {
    const user = useSelector((state: RootState) => state.user.user);


  const dispatch = useDispatch();
  const { data } = useCurrentUser(!user);
  useEffect(() => {

    if (data) {
      dispatch(setUser(data?.user));
    }

  }, [data]);
  

  return children;
}