import { writable } from "svelte/store"
import { axios, configAxios } from "@core/axios"

let isLoggedIn = false
const {set, subscribe} = writable({
    loggedIn: isLoggedIn
})

const setUser = (data, token) => {
    data.loggedIn = isLoggedIn

    configAxios({
        headers: {
            "access-token": token
        }
    })
    set(data)
}

const setLoading = () => {
    set({
        loading: true
    })
}



const SERVER_URL = "http://localhost:3400"

const user = {
    subscribe,
    register: async (data) => {
        const result = await axios.post(`${SERVER_URL}/auth/register`, data)
        const { token, user } = result.data

        isLoggedIn = true
        cacheToken(token)
        setUser(user, token)
    },
    login: async (data) => {
        const result = await axios.post(`${SERVER_URL}/auth/login`, data)
        const { token, user } = result.data

        isLoggedIn = true
        cacheToken(token)
        setUser(user, token)
    },
    logout: () => {
        isLoggedIn = false
        clearStoredToken()
        setUser({})
    },
}

user.subscribe(console.log)

const cacheToken = (token) => {
    localStorage.token = token
}

const getStoredToken = () => {
    return localStorage.token
}

const resumeSession = async () => {
    let token = getStoredToken()

    if (!token) return

    setLoading()

    const result = await axios.post(`${SERVER_URL}/auth/authenticate`, {token})

    const { user } = result.data

    isLoggedIn = true
    setUser(user, token)
}

resumeSession()

export default user