import { API, token } from "./otherService";


class DepartmentService{
 
  static async getAllDepatments(){
    const res=await fetch(`${API}/departments`,{method:"GET",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`}});

    const result=await res.json();

    return result;
  }
}
export default DepartmentService