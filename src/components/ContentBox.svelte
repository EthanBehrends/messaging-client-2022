<script>
    export let fitMode = "contain"
    export let width = "unset"
    export let height = "auto"
    export let ratio = "1/1"
    export let style = ""
</script>

<div style="width: {width}; height: {height}; object-fit: {fitMode}; aspect-ratio: {ratio}; {style}">
    <slot />
</div>