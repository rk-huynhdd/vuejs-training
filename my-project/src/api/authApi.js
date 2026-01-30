import clientApi from "./clientApi"
import Cookies from "js-cookie";

const loginUser = async (credential)=>{
    const response = await clientApi.post("/auth/login", credential);
   
    return response
}
const getProfile = async()=>{
    const response = await clientApi.get("/auth/me")
 
    return response
}   
const getRefreshToken = async()=>{
   
    const response = await  clientApi.post("/auth/refresh", {
       refreshToken: Cookies.get("refresh"),
    expiresInMins: 30,
    }, {withCredentials: false});
    return response

}
export{loginUser, getProfile, getRefreshToken}