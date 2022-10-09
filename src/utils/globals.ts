type AnimationOptions = {
    duration: number|string;
    timingFunction: (dT: number) => number,
    onEnd: Function
}
export const PowerAnimation = (
        animFunc: Function, 
        options: Partial<AnimationOptions> = {}
    ) => {
    let start: number
    let done = false

    let durationInit: number|string|undefined = options.duration
    let duration: number

    if (durationInit !== undefined) {
        if (typeof durationInit === "string") {
            duration = parseInt(durationInit) * (({
                "s": 1000,
                "ms": 1
            })[durationInit?.match(/m?s/)[0]] ?? 1)
        } else {
            duration = durationInit
        }
    }

    let timingFunction = options.timingFunction ?? ((v) => v)
    let onEnd = options.onEnd ?? (() => {})

    const end = () => done = true

    const step = (timestamp: DOMHighResTimeStamp) => {
        if (start === undefined) start = timestamp

        const elapsed = timestamp - start

        if (elapsed > duration) done = true

        if (!done) {
            const dT = timingFunction(elapsed / duration)
            animFunc(dT, end)

            window.requestAnimationFrame(step)
        } else {
            onEnd()
        }
    }

    window.requestAnimationFrame(step)
}

export const generateId = (length = 16) => {
    let id = ""

    while (id.length < length) {
        id += (Math.random() * Date.now()).toString(32).replace(".","")
    }

    return id.substr(0, length)
}

export function domInitialize(selector: string, callback: () => {}, root = document.body) {
	if (!window.MutationObserver) return

	const config = { childList: true, subtree: true }

	let mO = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			Array.from(mutation.addedNodes).forEach(element => {
				if (element.matches && element.matches(selector)) callback(element)
			})
		})
	})

	mO.observe(root, config)

	return () => mO.disconnect()
}