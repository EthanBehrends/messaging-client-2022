<script>
    import ChatContainer from "@components/ChatContainer.svelte";
    import { params } from "@roxi/routify"
    import { get } from "svelte/store"
    import { channels } from "@core/messaging"

    $: channelId = $params.channel
    $: _channelsStore = channels.store
    $: _channel = $_channelsStore.find(c => get(c)._id == channelId)
</script>

<ChatContainer channel={$_channel} />

