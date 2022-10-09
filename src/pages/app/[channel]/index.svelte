<script>
    import ChatContainer from "@components/ChatContainer.svelte";
    import { params } from "@roxi/routify"
    import { get } from "svelte/store"
    import { channels } from "@core/messaging"

    $: channelId = $params.channel
</script>

<ChatContainer channel={{_id: channelId}} />

