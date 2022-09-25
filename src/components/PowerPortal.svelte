<script context="module">
    import { tick } from "svelte";

    export function portal(el, target = document.body) {
      let targetElement;
      
      async function update(newTarget) {
        target = newTarget;
        if (typeof target === "string") {
          targetElement = document.querySelector(target);
          if (targetElement === null) {
            await tick();
            targetElement = document.querySelector(target);
          }
          if (targetElement === null) {
            throw new Error(`Element not found: "${target}"`);
          }
        } else if (target instanceof HTMLElement) {
          targetElement = target;
        } else {
            throw new Error(`Element not found: "${target}"`);
        }
        Array.from(el.children).forEach(el => {
          targetElement.appendChild(el);
        })
        el.hidden = false;
      }

      function destroy() {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }


      update(target)



      return {
        update,
        destroy
      }
    }
  </script>
  
  <script>
    export let target = document.body;
  </script>
  
  <div use:portal={target} hidden>
    <slot />
  </div>