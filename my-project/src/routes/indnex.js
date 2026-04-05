import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../pages/admin/Dashboard.vue";
import Login from "../pages/auth/Login.vue";
import EmployeeList from "../pages/employee/EmployeeList.vue";
import EmployeeDetails from "../pages/employee/EmployeeDetails.vue";
import UserProfile from "../pages/user/UserProfile.vue";
import useAuthStore from "../stores/auth";
import Cookies from "js-cookie";
import NotAllowed from "../pages/system/NotAllowed.vue";
import NotFound from "../pages/system/NotFound.vue";
import Chart from "../pages/admin/Chart.vue";
import EmployeeLeave from "../pages/employee/EmployeeLeave.vue";
import AdminLeave from "../pages/admin/AdminLeave.vue";

import FormDetails from "../pages/admin/FormDetails.vue";

const routes = [
    {
        path:"/",
        redirect:"/login"
    },
    {
         path:"/chart",
         name:"Chart",
         component:Chart,
         meta:{
            requireLoggedIn:true
         },
           beforeEnter:(to, from)=>{
            if(localStorage.getItem("role")!=='admin'){
                return{
                    name:'NotAllowed'
                }
            }
        }
    },
    {
        path:"/dashboard",
        name:"Dashboard",
        component:Dashboard,
        meta:{
            requireLoggedIn: true
        },
        beforeEnter:(to, from)=>{
            if(localStorage.getItem("role")!=='admin'){
                return{
                    name:'NotAllowed'
                }
            }
        }


    },
    {
        path:"/login",
        name:'Login',
        component:Login, 
        beforeEnter:(to, from)=>{
            if(Cookies.get('userToken')){
                if(localStorage.getItem("role")==="admin"){
                return{
                    name:"Dashboard"
                }
               

            }
            else {
                return{
                    path:'/employees'
                }
            }
            }
            
        }
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
    }, 
    {
        path:'/leave', 
        name: 'EmployeeLeave',
        component:EmployeeLeave,
          meta:{
            requireLoggedIn: true
        },
        beforeEnter:()=>{
            if(localStorage.getItem('role')==='admin'){
                return{
                    name:"AdminLeave"
                }
            }
        }

    }, 
    {
        path:'/admin/leave',
        name:"AdminLeave",
        component:AdminLeave,
     
        beforeEnter:(to, from )=>{
            if(localStorage.getItem('role')!=='admin'){
                return{
                    name:"NotAllowed"
                }
            }

        }
    },
    {
        path:"/admin/leave/:formId",
       
                name:"FormDetails",
                component: FormDetails
        
    },
    {    path:"/403",
        name:'NotAllowed',
        component:NotAllowed
    },
    {
        path:"/:pathMatch(.*)*",
        name:'NotFound',
        component:NotFound
    }
  
    
]

const router = createRouter({
    history:createWebHistory(),
    routes
})
router.beforeEach( (to, from )=>{
    const authStore = useAuthStore();
    if(Cookies.get('userToken')){
        authStore.getUser()
    } 
 
    if(to.meta.requireLoggedIn && ! authStore.isLoggedIn){
        
        return{name:"Login"}
    }
    return true 
})
export default router