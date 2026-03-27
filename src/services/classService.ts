import { store } from "@/store/store";
import { API} from "./otherService";

class ClassService{

     static getToken() {
    return store.getState().user.token;
  }

   static async createClass(data){
        const res=await fetch(`${API}/class/create`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${this.getToken()}`},body:JSON.stringify(data)});

        return await res.json(); 
    }

    static async getClasses(category){
        const res=await fetch(`${API}/class/all?category=${category}`,{method:"GET",headers:{"Content-Type":"application/json","Authorization":`Bearer ${this.getToken()}`}});
        return await res.json();
    }

}
export default ClassService;