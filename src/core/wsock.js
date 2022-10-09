import { io } from "socket.io-client"
import { cacheRecord } from "@core/data"

const socket = io("http://localhost:3400")

const handleMessage = (payload) => {
    console.log(payload)
    let { action, data } = payload

    let [type, updateType] = action.split("_")

    if (updateType == "Deleted") {
        deleteRecord(data, type)
    } else {
        cacheRecord(data, type)
    }
}

socket.on("action", handleMessage)