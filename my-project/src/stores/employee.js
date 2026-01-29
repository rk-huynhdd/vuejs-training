import { defineStore } from "pinia";
import { ref } from "vue";
import useUiStore from "./UIstore";
import { getEmployee } from "../api/employeeApi";

const useEmployees = defineStore('employees', ()=>{
    const employeeList = ref([]);
    const getData = async()=>{
        const UIstore = useUiStore();
        UIstore.isLoading= true;
       try{
        const response = await getEmployee();
        employeeList.value= response;
       }
       catch(err){
        UIstore.error= err

       }
       finally{
        UIstore.isLoading=false
       }

    }
    return{employeeList, getData}
})  

export default useEmployees