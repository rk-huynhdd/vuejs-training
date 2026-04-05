import axios from "axios";
import Cookies from 'js-cookie'
const clientApi = axios.create({
    baseURL:'https://dummyjson.com',
    headers :{
       'Content-Type': 'application/json',

    },
    timeout:10000
})
clientApi.interceptors.request.use((config)=>{
    if(Cookies.get("userToken")){
        config.headers.Authorization=  `Bearer ${Cookies.get("userToken")}` 
    }
    
    return config
}, (error)=>{
    return Promise.reject(error)

})
clientApi.interceptors.response.use((response )=>{
 return response.data
}, (error)=>{
    
    return Promise.reject(error)
})

export default clientApi