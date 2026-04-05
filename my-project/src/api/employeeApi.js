import clientApi from "./clientApi"

const getEmployee = async ()=>{
    const response = await clientApi.get("/users");
    return response.users
}
const getOne = async(id)=>{
  const response = await clientApi.get(`/users/${id}`)
 
  return response
}

export {getEmployee, getOne}