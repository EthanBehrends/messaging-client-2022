<script>
    import Popup from "./Popup.svelte";
    import Icon from "@iconify/svelte"
    import SmartInput from "./SmartInput.svelte"
    import Button from "@components/Button.svelte";
    import Record from "@components/Record.svelte";
    import { axios } from "@core/axios"
    import { channels } from "@core/messaging"

    const _channels = channels.store

    let showPopup

    let channelName
    const addChannel = async () => {
        await axios.post("/app/Channel/add", {name: channelName})
        showPopup(false)
    }
</script>

<div class="w-full h-full py-2 bg-indigo-900">
    <div class="flex justify-between p-2 text-sm items-center">
        <div class="text-white font-semibold">
            Channels
        </div>
        <div class="text-white hover:opacity-80 cursor-pointer" on:click={() => showPopup()}>
            <Icon icon="material-symbols:add-circle-rounded" height="1.5rem" />
        </div>
    </div>
    {#each $_channels as _channel}
    <Record record={_channel} let:record={channel}>
        <a blank href={`/app/${channel._id}`} class="cursor-pointer flex items-center py-1 px-4 font-medium text-indigo-100 hover:bg-indigo-500">
            {channel.name}
        </a>
    </Record>
    {/each}
</div>

<Popup bind:show={showPopup} title="Add Channel">
    <div class="flex flex-col p-4 pt-0 gap-4 w-100 max-w-screen">
        <SmartInput bind:value={channelName} label="Channel Name" class="!p-2" focus/>
        <div class="w-40 self-end">
            <Button onClick={addChannel}>Add</Button>
        </div>
    </div>
</Popup>