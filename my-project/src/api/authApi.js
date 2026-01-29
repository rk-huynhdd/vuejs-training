import clientApi from "./clientApi"

const loginUser = async (credential)=>{
    const response = await clientApi.post("/auth/login", credential);
   
    return response
}
const getProfile = async()=>{
    const response = await clientApi.get("/auth/me")
 
    return response
}
export{loginUser, getProfile}