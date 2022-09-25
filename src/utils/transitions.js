import { backOut } from "svelte/easing"

export function flyIn(node, { delay = 0, duration = 200, easing = backOut, x = 0, y = 150, opacity = 0, scale = .5 } = {}) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const od = target_opacity * (1 - opacity);
    return {
        delay,
        duration,
        easing,
        css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px) scale(${scale + (1 - scale) * t});
			opacity: ${target_opacity - (od * u)}`
    };
}