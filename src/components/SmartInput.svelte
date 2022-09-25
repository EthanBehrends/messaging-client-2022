<script>
    import { onMount } from "svelte"
    export let name = ""
    export let label = ""
    let className = ""
    export { className as class }
    export let value
    export let focus = false

    let labelElement, input, inputHeight, labelHeight

    let inputId = Math.random()
    let focused = false

    $: placeholderMode = !focused && !value

    $: inputStyle = input ? getComputedStyle(input) : undefined

    $: styleStr = inputStyle && placeholderMode ? `transform: scale(1) translate(${inputStyle.paddingLeft}, ${labelHeight + parseInt(inputStyle.paddingTop)}px)` : "transform: scale(.8) translate(0,0)"

    onMount(() => { 
        if (focus) input.focus()
    })
</script>

<style>
.labelText {
    transition: .2s;
    z-index: 1;
    transform-origin: bottom left;
    user-select: none;
    opacity: 1;
}
.labelText.placeholderMode {
    pointer-events: none;
    opacity: .65;
}
</style>

<div class="flex-grow relative">
    <label for={inputId} class="block leading-none focus-within:text-primary text-gray-600">
        <div bind:this={labelElement} bind:offsetHeight={labelHeight} class="labelText relative text-sm font-light" class:placeholderMode style={styleStr}>
            {label}
        </div>
        <div bind:offsetHeight={inputHeight} class="z-0">
            <input bind:value id={inputId} on:focus={() => focused = true} on:blur={() => focused = false} bind:this={input} type="text" {name} class={className} {...$$restProps} />
        </div>
    </label>
</div>