<script>
    import { generateFakeMessage } from "@utils/faker";
    import ChatTextBox from "./ChatTextBox.svelte";
    import Record from "./Record.svelte";
    import { axios } from "@core/axios"
    import { slide} from "svelte/transition"
    import { DataInstance } from "@core/data"
    import Icon from "@iconify/svelte"
    import user from "@core/user";
  import Popup from "./Popup.svelte";
  import SmartInput from "./SmartInput.svelte";
  import Button from "./Button.svelte";

    export let channel = {}

    const ds = new DataInstance("Message")

    ds.fetch()

    const _messages = ds._records

    const _filters = ds._filters
    const _sorts = ds._sorts
    _sorts.set({sentAt: -1})

    $: _filters.set({channel: {field: "channel", op: "eq", value: channel._id}})

    $: console.log($_filters)
    const sendMessage = async (message) => {
        console.log(message, channel)
        await axios.post("/app/Message/add", {content: message, channel: channel._id})
    }

    let showEditPopup
    let messageEditing
    let messageEditingContent
    const editMessage = (message) => {
        messageEditing = message
        messageEditingContent = message.content
        showEditPopup()
    }

    const saveEditMessage = async () => {
        await axios.post("/app/Message/update", {_id: messageEditing._id, content: messageEditingContent})
        showEditPopup(false)
    }
    let showDeletePopup
    let messageDeleting
    const deleteMessage = (message) => {
        messageDeleting = message
        showDeletePopup()
    }

    const saveDeleteMessage = async () => {
        await axios.post("/app/Message/delete", {_id: messageDeleting._id})
        showDeletePopup(false)
    }
</script>

<div class="h-full flex flex-col relative chat-container overflow-hidden">
    <div class="flex-grow flex z-0 flex-col-reverse overflow-y-auto">
        {#if _messages}
        {#each $_messages as _message (_message._id)}
        <Record record={_message} let:record={message}>
            <div class="group flex flex-col gap-2 border-t p-2 px-4 border-cool-gray-300" in:slide|local>
                <div class="flex justify-between">
                    <div class="text-sm">
                        {message.userDisplay}
                    </div>
                    <div class="flex gap-4">
                        {#if message.createdBy == $user._id && !message.deleted}
                            <div on:click={() => deleteMessage(message)} class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 cursor-pointer">
                                <Icon icon="material-symbols:delete-rounded" />
                            </div>
                            <div on:click={() => editMessage(message)} class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 cursor-pointer">
                                <Icon icon="material-symbols:edit" />
                            </div>
                        {/if}
                        <div class="text-xs font-light text-gray-600">
                            {dayjs(message.sentAt).fromNow()}
                        </div>
                    </div>
                </div>
                <div class="font-light text-sm">
                    {#if message.deleted}
                    <div class="text-gray-600 text-xs">Message Deleted <div class="inline text-xl">🗑</div></div>
                    {:else}
                    {message.content}
                    {#if message.edited}
                    <div class="text-gray-400 inline text-xs">(Edited)</div>
                    {/if}
                    {/if}
                </div>
            </div>
        </Record>
        {/each}
        {/if}
    </div>
    <div class="chat-box-container h-40 flex-shrink-0 z-10 flex bg-cool-gray-400 flex-col p-4">
        <ChatTextBox {sendMessage} />

    </div>
</div>

<Popup bind:show={showEditPopup} title="Edit Message">
    <div class="flex flex-col p-4 pt-0 gap-4 w-100 max-w-screen">
        <SmartInput bind:value={messageEditingContent} label="Message" class="!p-2" focus/>
        <div class="w-40 self-end">
            <Button onClick={saveEditMessage}>Save</Button>
        </div>
    </div>
</Popup>

<Popup bind:show={showDeletePopup} title="Delete Message">
    <div class="flex flex-col p-4 pt-2 gap-4 w-100 max-w-screen">
        <div class="text-sm text-gray-700">Are you sure you want to delete this message? This cannot be undone.</div>
        <div class="w-40 self-end" style="--color-primary: #8b0000">
            <Button onClick={saveDeleteMessage}>Delete</Button>
        </div>
    </div>
</Popup>

<style>
    .chat-container {
        background: linear-gradient(120deg, hsl(204deg 44% 90%), hsl(204deg 44% 100%));
    }

    .chat-box-container {
        box-shadow: hsl(0deg 0% 0% / 50%) 0px 26px 11px 29px;
    }
</style>