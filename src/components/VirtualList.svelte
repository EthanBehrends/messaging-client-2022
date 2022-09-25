<script>
    import { onMount, tick } from "svelte"
    import { generateFakeUsers } from "../utils/faker"
    import Record from "./Record.svelte";
    export let records = []

    $: console.log(records)

    let height_map = []
    let integrated_height_map = []
    let averageHeight = 30

    let paddingTop, start, end, numberShown, paddingBottom
    let viewport, viewportHeight, viewportScroll
    let container, containerHeight = 0

    const handleScroll = async (e) => {
        // console.log(Date(), e)
        viewportScroll = viewport.scrollTop
        viewportHeight = viewport.offsetHeight

        if (!calculateVisibility()) return

        // await tick()

        setElementHeights()
    }

    const calculateVisibility = () => {
        let top = viewportScroll
        let bottom = viewportScroll + viewportHeight
        console.log({top})
        let newStart = getIndexAtHeight(top)
        console.log({top, newStart})
        let newEnd = getIndexAtHeight(bottom) + 1
        if (newStart == start && newEnd == end) return false

        start = newStart
        end = newEnd
        numberShown = end - start

        if (end > records.length) end = records.length

        paddingTop = start ? getHeightAtIndex(start) : 0
        paddingBottom = getHeightAtIndex() - getHeightAtIndex(end + 1)
        containerHeight = getHeightAtIndex()
        return true
    }

    const setElementHeights = () => {
        let integrate = false

        Array.from(container.children).forEach((element, i) => {
            if (height_map[start + i] != element.offsetHeight) integrate = true
            height_map[start + i] = element.offsetHeight
        })

        if (integrate) integrateHeightMap()
    }

    const integrateHeightMap = () => {
        integrated_height_map = height_map.reduce((a,b) => {
            a.push(a.length ? a[a.length - 1] + b : b)
            return a
        }, [])

        averageHeight = integrated_height_map[integrated_height_map.length - 1] / integrated_height_map.length
    }

    const getHeightAtIndex = (index) => {
        if (!index) index = records.length - 1
        if (index == 0) return 0

        let heightVal = integrated_height_map[index - 1]

        if (!heightVal) heightVal = Math.round(averageHeight * index)

        return heightVal
    }

    const getIndexAtHeight = (height, debug = false) => {
        if (integrated_height_map.at(-1) >= height) {
            return binarySearch(integrated_height_map, (val, i, arr) => {
                if (height < (i ? arr[i - 1] : 0)) return -1
    
                if (height > val) return +1
    
                return 0
            })
        } else {
            return Math.min(records.length - 1, Math.round((height - (integrated_height_map.at(-1) ?? 0)) / averageHeight + integrated_height_map.length))
        }
    }

    const binarySearch = (arr, func, min, max, debug = false) => {
        if (debug) console.log(min, max)
        if (min == undefined) min = 0
        if (max == undefined) max = arr.length - 1

        if (min == max) return min

        let index = Math.floor((max - min) / 2) + min
        
        let result = func(arr[index], index, arr)
        
        if (result == +1 && index < arr.length - 1) return binarySearch(arr, func, index + 1, max)
        if (result == -1 && index > 0)          return binarySearch(arr, func, min, index - 1)

        return index
    }

    onMount(() => {
        records = generateFakeUsers(1000)
        handleScroll()
    })
</script>

<!-- <div class="fixed bg-white top-0 left-0">{paddingTop} {start} {end} {paddingBottom} {paddingTop + (end - start) * averageHeight + paddingBottom}</div> -->
<div
    bind:this={viewport}
    on:scroll={handleScroll}
    class="h-full overflow-y-auto border-t"
    >
    <div bind:this={container} class="w-full" style="padding-top: {paddingTop}px; height: {containerHeight}px">
        {#each Array.from({length: numberShown}) as x, i (i)}
            <Record record={records[start + i]} let:record>
                <div class="cursor-pointer hover:bg-gray-100 border-b-1 p-2 text-sm font-semibold">{start + i}. {record?.name}</div>
            </Record>
        {/each}
    </div>
</div>