import { API,token } from "./otherService";


class UserService{

  static async getCurrentUser(){
    const res=await fetch(`${API}/users/me`,{method:"GET",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`}});

    const result=await res.json();
    return result;
  }
  static async addProf(data){
    const res=await fetch(`${API}/users/professor`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(data)});
    const result=await res.json();
    return result;
  }
  static async getUsers(role:string){
    const res=await fetch(`${API}/users?role=${role}`,{method:"GET",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`}});
    const result=await res.json();
    return result;
  }

  static async addStudent(data){
    const res=await fetch(`${API}/users/student`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(data)});

    const result=await res.json();
    return result;
  }
}

export default UserService