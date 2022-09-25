import { writable, get } from "svelte/store"
import { axios } from "@core/axios"

const channelsStore = writable([])

const messageStores = {}
const allMessages = {}

const initChannelStore = (channel) => {
    const channelId = channel._id

    let lastSeen = localStorage[`lastSeen_${channelId}`] ?? new Date()

    const messageStore = initMessageStore(channelId)

    const store = writable(channel)

    const _set = store.set
    store.set = (data = get(store)) => {
        data.messages = messageStore
        data.lastSeen = lastSeen
        data.newMessages = messagesSentAfter(get(messageStore), lastSeen)

        _set(data)
    }

    store.setSeen = function() {
        lastSeen = new Date()
        this.set()
    }

    const messagesSentAfter = (messages, lastSeen) => messages.reduce((sum, store) => sum + get(store).date > lastSeen, 0)

    messageStore.subscribe(r => {
        store.set()
    })

    channelsStore.update(r => [...r, store])
}

const initMessageStore = (channelId) => {
    if (!messageStores[channelId]) {
        messageStores[channelId] = writable([])
    }

    return messageStores[channelId]
}

export const channels = {
    add(data) {
        initChannelStore(data)
    },
    update(data) {
        const channel = channelsStore.find(channel => channel._id == data._id)

        channel.set(data)
    },
    delete(data) {
        channelsStore.update(channels => channels.filter(c => c._id != data._id))
    },
    store: channelsStore
}

export const messages = {
    add(data) {
        const id = data._id
        
        const message = writable(data)
        allMessages[id] = message

        const channelId = data.channel

        const messageStore = initMessageStore(channelId)

        messageStore.update(messages => {
            let index = messages.length

            while (index > 0) {
                let existingMessage = get(messages[index - 1])

                if (existingMessage.date < data.date) {
                    break
                } else {
                    index--
                }
            }

            messages.splice(index, 0, message)
            return [...messages]
        })

        console.log(message)
    },
    update(data) {
        const message = allMessages[data._id]

        message.set(data)
    },
    delete(data) {
        const message = allMessages[data._id]

        message.update(message => {
            message.deleted = true
            return message
        })
    }
}

export const fetchInitialData = () => {
    axios.get("/app/Channel").then(({data}) => {
        data.forEach(channels.add)
    })
    axios.get("/app/Message").then(({data}) => {
        data.forEach(messages.add)
    })
}