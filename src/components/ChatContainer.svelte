<script>
    import { generateFakeMessage } from "@utils/faker";
    import ChatTextBox from "./ChatTextBox.svelte";
    import Record from "./Record.svelte";
    import { axios } from "@core/axios"
    import { slide} from "svelte/transition"

    export let channel = {}

    console.log(channel)
    $: _messages = channel.messages

    $: console.log($_messages)

    const sendMessage = async (message) => {
        console.log(message, channel)
        await axios.post("/app/Message/add", {content: message, channel: channel._id})
    }
</script>

<div class="h-full flex flex-col">
    <div class="flex-grow flex flex-col-reverse overflow-y-auto">
        {#if _messages}
        {#key channel._id}
        {#each $_messages as _message}
            <Record record={_message} let:record={message}>
                {#key message._id}
                <div class="flex flex-col gap-2 border-b p-2 px-4" in:slide|local>
                    <div class="flex justify-between">
                        <div class="text-sm">
                            {message._id}
                        </div>
                        <div class="text-xs font-light text-gray-600">
                            {message.sentAt.toLocaleString()}
                        </div>
                    </div>
                    <div class="font-light text-sm">
                        {message.content}
                    </div>
                </div>
                {/key}
            </Record>
        {/each}
        {/key}
        {/if}
    </div>
    <div class="h-40 flex-shrink-0 flex bg-gray-200 flex-col shadow-xl p-4">
        <ChatTextBox {sendMessage} />

    </div>
</div>

