import { API } from "./otherService";

class AuthService{

  static async adminLogin(data){
    const res=await fetch(`${API}/auth/admin/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});

    return await res.json();
  }
}

export default AuthService;