import { defineStore } from "pinia";
import { ref } from "vue";

const useUiStore= defineStore('UI', ()=>{
    const isLoading = ref(false);
    const error = ref(""); 
    return{isLoading, error}
})
export default useUiStore