import clientApi from "./clientApi"

const getEmployee = async ()=>{
    const response = await clientApi.get("/users");
    return response.users
}

export {getEmployee}