<script>
    import tether from "@utils/tether";
    import Icon from "@iconify/svelte"
    import { flyIn } from "@utils/transitions"
    import { fade } from "svelte/transition"

    let showPanel = false
    export const show = (val = true) => {
        showPanel = val
    }
    export const close = () => show(false)
    export let closeOnClickOutside = true
    export let mask = true
    export let showHeader = true
    export let title = ""

    const tetherOptions = {
        target: document.body,
        attachment: "center center",
        targetAttachment: "center center"
    }
</script>

{#if showPanel}
    <div class="z-999" use:tether={tetherOptions}>
        <div transition:fade={{duration: 100}} class="absolute left-[-75vw] top-[-75vh] w-[300vw] h-[300vh] bg-gray-900 opacity-50"></div>
        <div transition:flyIn={{duration: 300}} class="relative rounded shadow-xl bg-white">
            {#if showHeader}
                <div class="p-4 pb-0 w-full flex justify-between items-center">
                    <div class="text-lg font-semibold">{title}</div>
                    <div class="rounded-full hover:bg-gray-400 hover:text-white cursor-pointer -m-1 p-1" on:click={close}>
                        <Icon icon="material-symbols:close" height="1rem" />
                    </div>
                </div> 
            {/if}
            <slot />
        </div>
    </div>
{/if}