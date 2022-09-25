import { io } from "socket.io-client"
import { channels, messages } from "@core/messaging"

const socket = io("http://localhost:3400")

socket.on("action", (data) => handleMessage(data))

const handleMessage = (payload) => {
    console.log(payload)
    let { action, data } = payload

    let [model, type] = action.split("_")

    actions[model]?.[type]?.(data)
}

const actions = {
    Channel: {
        Added: channels.add,
        Updated: channels.update,
        Deleted: channels.delete,
    },
    Message: {
        Added: messages.add,
        Updated: messages.update,
        Deleted: messages.delete,
    },
}