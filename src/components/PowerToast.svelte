<script lang="ts">
    import { PowerAnimation, generateId } from "../utils/globals"
    import { slide, fly } from "svelte/transition"
    import { cubicOut } from "svelte/easing"
    import Icon from "@iconify/svelte"
import { tick } from "svelte";

    let popups: object = {}
    let popupRootElement: HTMLElement

    export const popup = async (popupData) => {
        const popupId: string = generateId()
        popupData.__popupId = popupId

        popups = {
            [popupId]: popupData,
            ...popups,
        }

        await tick()

        let element: HTMLElement = popupRootElement.querySelector(`#popup_${popupId}`)
        let timerElement: HTMLElement = element.querySelector("[timer]")

        PowerAnimation((dT: number) => {
            timerElement.style.width = `${dT * 100}%`
        }, {
            duration: popupData.time,
            timingFunction: cubicOut,
            onEnd: () => {
                close(popupId)
            }
        })
    }

    const close = (popupId: string) => {
        delete popups[popupId]
        popups = {...popups}
    }
</script>

<style>
    .mask-fade-y {
        -webkit-mask-image: linear-gradient(transparent 0%, black 30%)
    }
</style>

<div class="relative h-full w-full mask-fade-y pointer-events-none">
    <div bind:this={popupRootElement} class="h-full flex items-end overflow-y-auto flex-col-reverse">
        {#each Object.entries(popups) as [key, popup], i (key ?? i)}
            <div transition:slide class="flex-shrink-0 pointer-events-auto pt-4">
                <div id={`popup_${key}`} transition:fly={{x: 200}} class="w-100 min-h-50 bg-white flex flex-col shadow-xl rounded overflow-hidden">
                    <div class="flex-grow p-4 flex flex-col gap-2">
                        <div class="flex items-center">
                            <div class="font-semibold flex-grow">{popup.title}</div>
                            <div class="cursor-pointer hover:bg-gray-200 rounded" on:click={() => close(key)}>
                                <Icon icon="material-symbols:close" />
                            </div>
                        </div>
                        <div class="text-sm">{popup.description}</div>
                    </div>
                    <div class="h-2 bg-gray-200">
                        <div timer class="h-2 bg-primary">
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
