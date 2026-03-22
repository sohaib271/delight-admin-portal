import { API, token } from "./otherService";

class ClassService{

   static async createClass(data){
        const res=await fetch(`${API}/class/create`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(data)});

        return await res.json(); 
    }

    static async getClasses(category){
        const res=await fetch(`${API}/class/all?category=${category}`,{method:"GET",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`}});
        return await res.json();
    }
}
export default ClassService;