<script>
    import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

    export let sendMessage = async () => {}

    const send = async () => {
        console.log(value)
        if (!value) return

        await sendMessage(value)

        value = undefined
    }

    const onKeydown = (e) => {
        if (e.key == "Enter" && e.metaKey) send()
    }
    let value
</script>
<div class="flex-grow relative ">
    <textarea bind:value on:keydown={onKeydown} class="border-1 border-cool-gray-600 rounded resize-none p-2 text-sm pr-18 h-full w-full shadow-xl"></textarea>
    <div class="absolute bottom-2 right-2">
        <div class="rounded-full p-2 icon-container text-white cursor-pointer" on:click={send}>
            <Icon height="2rem" icon="material-symbols:send-rounded" />
        </div>
    </div>
</div>

<style>
    .icon-container {
        @apply shadow;
        transform: translate(0,0);
        transition: .2s;
        background: linear-gradient(120deg,hsl(196deg 100% 14%) 33%, hsl(196deg 100% 14% / 57%));
    }
    .icon-container:hover {
        transform: translateY(-2px);
    }
    .icon-container:active {
        transform: translateY(2px);
    }
</style>
