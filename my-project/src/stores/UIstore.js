import { defineStore } from "pinia";
import { ref } from "vue";

const useUiStore= defineStore('UI', ()=>{
    const isLoading = ref(false);
    const error = ref(""); 
    const success = ref(""); 
    const showSuccess = ref(false)
    const showError= ref(false); 
    return{isLoading, error, showSuccess, showError, success}
})
export default useUiStore