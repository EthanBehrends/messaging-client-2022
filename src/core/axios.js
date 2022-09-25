import _axios from "axios"

const baseURL = "http://localhost:3400"

export let axios = _axios.create({baseURL})

export const configAxios = (config) =>  {
    axios = _axios.create({...config, baseURL})
}

window.axios = axios