import Tether from "tether"
import { tick } from "svelte"

export default function tether(element: HTMLElement, tetherOptions: any) {
  tetherOptions.element = element

  let tether

  function update(options: any) {
    options.element = element

    if (!tether) {
      tether = new Tether(options)
    } else {
      tether.setOptions(options)
    }
    
    tick().then(() => tether.position())
  }

  update(tetherOptions)

  function destroy() {
    tether.destroy()
  }

  return {
    update,
    destroy
  }
}