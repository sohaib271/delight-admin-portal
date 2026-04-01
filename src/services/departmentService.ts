import { store } from "@/store/store";
import { API} from "./otherService";


class DepartmentService{

   static getToken() {
    return store.getState().user.token;
  }
 
  static async getAllDepatments(){
    const res=await fetch(`${API}/departments`,{method:"GET",headers:{"Content-Type":"application/json","Authorization":`Bearer ${this.getToken()}`}});

    const result=await res.json();

    return result;
  }
}
export default DepartmentService