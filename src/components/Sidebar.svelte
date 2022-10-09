<script>
    import Popup from "./Popup.svelte";
    import Icon from "@iconify/svelte"
    import SmartInput from "./SmartInput.svelte"
    import Button from "@components/Button.svelte";
    import Record from "@components/Record.svelte";
    import { axios } from "@core/axios"
    import { channels } from "@core/messaging"
    import { DataInstance } from "@core/data"
    import { get } from "svelte/store"
    import { params } from "@roxi/routify";

    const ds = new DataInstance("Channel")
    ds.fetch()

    const _channels = ds._records

    window.get = get
    window._channels = _channels

    let showPopup

    let channelName
    const addChannel = async () => {
        await axios.post("/app/Channel/add", {name: channelName})
        showPopup(false)
    }
</script>

<div class="w-full h-full py-2 sidebar">
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
        <a blank href={`/app/${channel._id}`} class="channel" class:selected={$params.channel == channel._id}>
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

<style>
    .sidebar {
        background: linear-gradient(90deg,hsl(196deg 100% 14%), hsl(196deg 100% 14% / 89%));
    }

    @property --left-opacity {
        syntax: '<percentage>';
        inherits: true;
        initial-value: 0%;
    }

    @property --right-opacity {
        syntax: '<percentage>';
        inherits: true;
        initial-value: 0%;
    }
    .channel {
        @apply flex items-center font-medium;
        cursor: pointer;
        color: white;
        --left-opacity: 0%;
        --right-opacity: 0%;
        background: linear-gradient(90deg,hsla(196deg 10% 74% / var(--left-opacity, 0%)), hsl(196deg 10% 74% / var(--right-opacity, 0%)));
        transition: .2s;
        transition-property: --right-opacity, --left-opacity, all;
        padding: .25rem 1rem;
    }
    .channel:hover {
        --right-opacity: 30%;
        /* background: linear-gradient(90deg,hsla(196deg 10% 74% / 0%), hsl(196deg 10% 74% / 30%)); */
        padding-left: 1.5rem;
    }
    .channel.selected {
        --left-opacity: 10%;
        /* background: linear-gradient(90deg,hsla(196deg 10% 74% / 10%), hsl(196deg 10% 74% / 30%)); */
        padding-left: 1.5rem;
    }
</style>