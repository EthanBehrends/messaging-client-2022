<script>
    import Icon from "@iconify/svelte";

    export let sendMessage = () => {}

    const onClick = () => {
        console.log(value)
        if (value) sendMessage(value)
    }
    let value
</script>
<div class="flex-grow relative ">
    <textarea bind:value class="border rounded resize-none p-2 text-sm pr-18 h-full w-full"></textarea>
    <div class="absolute bottom-2 right-2">
        <div class="rounded-full p-2 bg-indigo-900 text-white cursor-pointer hover:opacity-80" on:click={onClick}>
            <Icon height="2rem" icon="material-symbols:send-rounded" />
        </div>
    </div>
</div>
