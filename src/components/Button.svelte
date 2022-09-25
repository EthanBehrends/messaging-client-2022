<script>
    import SimpleLoader from "./loaders/SimpleLoader.svelte";
    let className = ""
    export { className as class }
    export let onClick = async () => {}
    export let disabled = false

let loading = false
const handleClick = async () => {
    if (loading) return
    try {
        loading = true
        await onClick()
    } catch {}
    finally {
        loading = false
    }
}

</script>

<style>
    .button {
        @apply bg-primary rounded cursor-pointer text-blue-50 p-2 text-center;
        transition: .2s;
        opacity: 1;
    }
    .button:hover, .button.loading {
        opacity: .75;
    }
    .button.disabled {
        @apply bg-gray-600 pointer-events-none;
    }
</style>
    
<div on:click={handleClick} class:loading class:disabled class="button relative {className}" {...$$restProps}>
    {#if loading}
    <div class="absolute inset-0 flex items-center justify-center">
        <SimpleLoader />
    </div>
    {/if}
    <div class:opacity-0={loading}>
        <slot />
    </div>
</div>