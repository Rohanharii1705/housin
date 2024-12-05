import axios from "axios"

const apiRequest= axios.create({
    baseURL:"https://housin-backend.onrender.com/api",
    withCredentials:true,
});

export default apiRequest;
