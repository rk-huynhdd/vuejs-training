import { defineStore } from "pinia";
import { ref } from "vue";
import { getProfile, loginUser } from "../api/authApi";
import useUiStore from "./UIstore";
import Cookies from 'js-cookie'
import { useRouter } from "vue-router";

const useAuthStore = defineStore('auth', ()=>{
    

    const router = useRouter(); 
    const user = ref({});
    const isLoggedIn = ref(Cookies.get('userToken')? true : false)
    const login = async (credential)=>{
        const UIstore = useUiStore();
        UIstore.isLoading= true; 
        credential.credentials="include"
        try{
             const user = await loginUser(credential);
             
             Cookies.set("userToken", user.accessToken, {expires: 7})
             await getUser()
           isLoggedIn.value= true
          if(localStorage.getItem('role')==='admin'){
            router.push("/")
          }
          else{
            router.push("/profile")
          }
              

        }
       catch(err){
        UIstore.error = "Please recheck your username or your password !!"
       }
       finally{
        UIstore.isLoading=false
       }
       
    }
    const getUser = async ()=>{
        const newLoggedInUser = await getProfile();
        user.value= newLoggedInUser
        localStorage.setItem("role", newLoggedInUser.role);
        localStorage.setItem('username', newLoggedInUser.username)
        

       
        
        
        
    }
    const logout = ()=>{
        
        localStorage.removeItem('role');
        localStorage.removeItem('username')
        Cookies.remove('userToken')
        router.push('/login')
    }
    return{ user, login, logout, getUser, isLoggedIn}
})
export default useAuthStore