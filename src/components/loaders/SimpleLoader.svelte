<script>
import { onMount } from "svelte";


    let iteration = 0

    const iterate = () => {
        iteration++
        iteration %= 4
    }

    onMount(() => {
        iterate()
        let interval = setInterval(iterate, 200)

        return () => clearInterval(interval)
    })
</script>
<style>
.dot {
    height: .5rem;
    width: .5rem;
    background-color: currentColor;
    border-radius: 9999px;
    transition: .2s ease-in-out;
}

.dot.active{
    height: 1em;
}
</style>

<div class="flex gap-2 h-[1em] justify-center items-end">
    {#each Array.from({length: 4}) as x, i}
    <div class="dot" class:active={iteration == i}></div>
    {/each}
</div>