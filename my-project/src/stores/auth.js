import { defineStore } from "pinia";
import { ref } from "vue";

const useAuthStore = defineStore('auth', ()=>{
    const role = ref("");
    const isLoggedIn = ref(true);
    const user = ref({});
    const login = ()=>{
        isLoggedIn.value= true
    }
    const logout = ()=>{
        isLoggedIn.value= false
    }
    return{role, isLoggedIn, user, login, logout}
})
export default useAuthStore