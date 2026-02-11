import { defineStore } from "pinia";
import { computed, ref,  } from "vue";
import useUiStore from "./UIstore";
import { getEmployee, getOne } from "../api/employeeApi";

const useEmployees = defineStore('employees', ()=>{
    const employeeList = ref([]);
    const currentEmployee = ref({}); 
    
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
   const getOneEmployee = async (id)=>{
    const UIstore = useUiStore();
    UIstore.isLoading=true; 
    try{
        const employee = await getOne(id);
        currentEmployee.value= employee;
    }
    catch(err){
        UIstore.error= err
    }
    finally{
        UIstore.isLoading=false
    }
   
    
    
   }
   const deleteEmployee = (id)=>{
    const UIstore= useUiStore();
    UIstore.isLoading= true; 
    setTimeout(()=>{
        let newEmployees; 
        if(id.length>0){
          newEmployees = employeeList.value.filter((employee)=>{
        return !id.includes(employee.id)
    }) 
        }
        else{
  newEmployees = employeeList.value.filter((employee)=>{
        return employee.id!==id
    })
        }
    
    employeeList.value= newEmployees
    UIstore.isLoading=false;
   UIstore.showSuccess=true

    }, 3000)
  
   }
   const getUpdated = (id, obj )=>{
   
    const UIStore = useUiStore();
    UIStore.isLoading=true; 
 
    const index = employeeList.value.findIndex((employee)=>{
        return employee.id ===id
    })
    

   
  for (const atr of Object.keys(obj)){
    employeeList.value[index][atr]= obj[atr]; 
  } 
  UIStore.isLoading=false
  UIStore.showSuccess= true
}
const titleList = computed(() => {
  let list = new Set();
  employeeList.value.forEach((employee) => {
    list.add(employee.company.title);
  });
  return [...list];
});
const departmentList = computed(() => {
  let list = new Set();
  employeeList.value.forEach((employee) => {
    list.add(employee.company.department);
  });
  return [...list];
});
// dữ liệu để thống kê 
const maleNumber = computed(()=>{
  return employeeList.value.filter((employee)=>{
    return employee.gender==='male'
  }).length
})
const femaleNumber = computed(()=>{
   return employeeList.value.filter((employee)=>{
    return employee.gender==='female'
  }).length
})
const departmentData = computed(()=>{
  const staticList =[]; 
  departmentList.value.forEach((department)=>{
    
   const employeeNumber = employeeList.value.filter((employee)=>{
    return employee.company.department===department
   }).length;
   staticList.push({
    type:department,
    value: employeeNumber
   })
  })
  return staticList
})
const titleData = computed(()=>{
  const staticList =[]; 
  titleList.value.forEach((title)=>{
    
   const employeeNumber = employeeList.value.filter((employee)=>{
    return employee.company.title===title
   }).length;
   staticList.push({
    type:title,
    value: employeeNumber
   })
  })
  return staticList 
})
 
    return{employeeList, getData, getOneEmployee, currentEmployee, deleteEmployee, getUpdated, departmentList, titleList, maleNumber, femaleNumber, departmentData, titleData}
})  

export default useEmployees