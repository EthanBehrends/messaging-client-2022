<script>
import { onMount } from "svelte";

export let debug = false


let container, height, lineHeight
$: if (container) lineHeight = parseInt(getComputedStyle(container).lineHeight)

$: height = container?.clientHeight
$: if (container) container.style.fontSize = ""
$: if (debug) console.log(height, lineHeight, container, container?.style.fontSize)
$: if ((!height || !lineHeight || height > lineHeight) && container) resolveHeight()

const precision = 0.25
const resolveHeight = async () => {

    height = container.clientHeight
    lineHeight = parseInt(getComputedStyle(container).lineHeight)
    let estimatedLines = Math.ceil(height / lineHeight)
    let fontSize = parseInt(getComputedStyle(container).fontSize)
    let sizeWindow = [1, fontSize]

    let nextAttempt = fontSize / estimatedLines
    let loopProtect = 20
    if (debug) console.log(sizeWindow)
    while (sizeWindow[1] - sizeWindow[0] > precision && loopProtect--) {
        if (debug) console.log({nextAttempt})
        container.style.fontSize = `${nextAttempt}px`
        height = container.clientHeight
        lineHeight = parseInt(getComputedStyle(container).lineHeight)
        estimatedLines = Math.ceil(height / lineHeight)

        if (debug) console.log(estimatedLines)

        sizeWindow[estimatedLines == 1 ? 0 : 1] = nextAttempt
        nextAttempt = (sizeWindow[1] - sizeWindow[0]) / 2 + sizeWindow[0]
    }
    container.style.fontSize = sizeWindow[0] + "px"
    if (debug) console.log(sizeWindow, fontSize)
}

</script>

<div bind:this={container} {...$$restProps} bind:offsetHeight={height}>
    <slot />
</div>