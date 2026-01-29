import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../pages/admin/Dashboard.vue";
import Login from "../pages/auth/Login.vue";
import EmployeeList from "../pages/employee/EmployeeList.vue";
import EmployeeDetails from "../pages/employee/EmployeeDetails.vue";
import UserProfile from "../pages/user/UserProfile.vue";
import useAuthStore from "../stores/auth";

const routes = [
    {
        path:"/",
        name:"Dashboard",
        component:Dashboard,
        meta:{
            requireLoggedIn: true
        },
        beforeEnter:(to, from)=>{
            const authStore = useAuthStore();
            if(authStore.role!=='admin'){
                return{
                    name:'Login'
                }
            }
        }


    },
    {
        path:"/login",
        name:'Login',
        component:Login
    },
    {
        path:"/employees",
        name:'EmployeeList',
        component:EmployeeList, 
         meta:{
            requireLoggedIn: true
        }
    },
    {
        path:'/employees/:id',
        name:'EmployeeDetails',
        component:EmployeeDetails, 
         meta:{
            requireLoggedIn: true
        }
    },
    {
        path:'/profile',
        name:'UserProfile',
        component:UserProfile, 
         meta:{
            requireLoggedIn: true
        }
    }
  
    
]

const router = createRouter({
    history:createWebHistory(),
    routes
})
router.beforeEach((to, from )=>{
    const authStore = useAuthStore(); 
    if(to.meta.requireLoggedIn && ! authStore.isLoggedIn){
        
        return{name:"Login"}
    }
    return true 
})
export default router