import Tether from "tether"

export default function tether(element: HTMLElement, tetherOptions: any) {
  tetherOptions.element = element

  let tether = new Tether(tetherOptions)

  function update(options: any) {
    options.element = element

    console.log({options})

    tether.setOptions(options)
  }

  function destroy() {
    tether.destroy()
  }

  return {
    update,
    destroy
  }
}