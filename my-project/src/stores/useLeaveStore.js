import { defineStore } from "pinia";
import { computed, ref, toRaw } from "vue";
import localforage from 'localforage'
import useAuthStore from "./auth";
import useUiStore from "./UIstore";
import _ from 'lodash';

const useLeaveStore = defineStore('leave',  ()=>{
    const authStore= useAuthStore();
    
  const forms = ref([]); 
  const allForms = ref([]); 
  const formDetails = ref(null); 
  const getCurrentForms = async()=>{


  const currentForms = await localforage.getItem(JSON.stringify(authStore.user.id)) || [];
    forms.value= currentForms
    }
 
  

  const addNewForm = async (newForm)=>{
    const UIStore = useUiStore(); 
      const check = forms.value.findIndex((items)=>{
        return items.date===newForm.date
    })
    
    if(check==-1){
     forms.value.unshift(newForm);
     UIStore.success="Successfully added";
     UIStore.showSuccess=true;
    
    }
    else{
      UIStore.error="Date has been used before";
      UIStore.showError=true; 
        return; 
    }
  await localforage.setItem(JSON.stringify(authStore.user.id), toRaw(forms.value))
    
  
  }
  const getAllForms = async ()=>{
     const UIStore= useUiStore(); 
     try{
  UIStore.isLoading= true; 
  const keys = await localforage.keys();
 

    
    for(const key of keys){
    let check=true; 
    const forms = await localforage.getItem(key);
    forms.forEach((form)=>{
       check = allForms.value.some((items)=>{
      return _.isEqual(items, form)
     })
      
    if(!check){
      allForms.value= allForms.value.filter((items)=>{
      return items.formId!==form.formId
      })
      allForms.value.unshift(form)
    }
    }) 
    
    
    
  }
} catch (error) {
  UIStore.showError=true;
  UIStore.error= "Something went wrong"
}
finally{
  UIStore.isLoading=false
}
 
  }
  const getFormDetails =  async (formId)=>{
   
    const form= [...allForms.value.flat()].find((items)=>{
     return items.formId===formId
    })
 
    formDetails.value= form
   
  }

  const changeFormStatus = async (userId, formId,  status)=>{
   
  
    const UIStore = useUiStore(); 
   if(!status){
     UIStore.showError=true;
     UIStore.error="Invalid status" ;
     return
    }
   try{
    UIStore.isLoading=true; 
     const currentForms = await localforage.getItem(userId);
   currentForms.forEach((items, index)=>{
    if(items.formId===formId){
   currentForms[index].status= status;
    }
   
   })
    await localforage.setItem(userId,currentForms );
     UIStore.showSuccess=true;
    UIStore.success="Saved your changes successfully. "; 
   }
   
   catch(err){
       UIStore.showError=true;
       UIStore.error="Something went wrong "
   }
  finally{
    UIStore.isLoading=false
  }
   

  }

  const updateForm=async  (formData)=>{
   const forms = await localforage.getItem(formData.userId);
   forms.forEach((form, index)=>{
   if(formData.formId === form.formId){
    forms[index] = formData
   }
   })
   await localforage.setItem(formData.userId, forms)
  }
  return{forms, addNewForm, getCurrentForms, getAllForms, allForms,changeFormStatus, getFormDetails, formDetails, updateForm}
})
export default useLeaveStore