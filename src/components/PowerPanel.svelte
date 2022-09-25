<script lang="ts">
    import PowerPortal from "./PowerPortal.svelte";
    import tether from "../utils/tether";
    import { fly, scale } from "svelte/transition"
    import { flyIn } from "../utils/transitions"
    import { generateId } from "../utils/globals"
    import { onMount } from "svelte";

    export let closeOnClickOutside = true

    export let target = document.body
    export let attachment = "middle left"
    export let targetAttachment = "middle right"
    export let tetherOptions = {
        constraints: [{
            to: "window",
            pin: true
        }]
    }

    export let group_id = ""
    group_id += generateId(6)
    

    let show = false
    export const showPanel = (val = !show) => show = val

    let panelElement: HTMLElement

    const handleDocumentClick = (e: MouseEvent) => {
        if (!show) return

        let panelClicked = e.composedPath().find(e => e.getAttribute?.("group_id")?.includes(group_id))
        if (panelClicked) return

        if (closeOnClickOutside) showPanel(false)
    }

    onMount(() => {
        document.addEventListener("mousedown", handleDocumentClick)

        return () => {
            document.removeEventListener("mousedown", handleDocumentClick)
        }
    })
</script>

<style>
    .panel-shadow {
        box-shadow: 0px 6px 9px 6px #13131382;
    }
</style>

{#if show}
    <div bind:this={panelElement} {group_id} transition:flyIn use:tether={{target, attachment, targetAttachment, ...tetherOptions}} class="panel-shadow min-w-60 min-h-40 absolute top-5 left-50 rounded bg-white z-99999">
        <slot {group_id}/>
    </div>
{/if}
