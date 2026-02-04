import { defineStore } from "pinia";
import { ref } from "vue";

const useUiStore= defineStore('UI', ()=>{
    const isLoading = ref(false);
    const error = ref(""); 
    const showSuccess = ref(false)
    return{isLoading, error, showSuccess}
})
export default useUiStore