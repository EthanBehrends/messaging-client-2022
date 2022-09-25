import { writable } from 'svelte/store'

let sessionStores = {}
let localStores = {}

export const SessionStore = function (name, defVal) {
    if (sessionStores[name]) return sessionStores[name]

    const initValue = sessionStorage.getItem(name) ?? JSON.stringify(defVal) ?? "{}"
    const store = writable(JSON.parse(initValue))

    const setSessionStorage = (value) => {
        sessionStorage.setItem(name, JSON.stringify(value))
    }

    const _set = store.set
    store.set = (value) => {
        _set(value)
        setSessionStorage(value)
    }

    sessionStores[name] = store
    
    return store
}

export const LocalStore = function (name, defVal) {
    if (localStores[name]) return localStores[name]

    const initValue = localStorage.getItem(name) ?? JSON.stringify(defVal) ?? "{}"
    const store = writable(JSON.parse(initValue))

    const setLocalStorage = (value) => {
        localStorage.setItem(name, JSON.stringify(value))
    }
    setLocalStorage(JSON.parse(initValue))

    const _set = store.set
    store.set = (value) => {
        _set(value)
        setLocalStorage(value)
    }

    localStores[name] = store
    
    return store
}