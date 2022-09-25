<script>
import './init'
import "./global.css"
import { Router } from "@roxi/routify"
import { routes } from "../.routify/routes"
import {setContext, getContext} from "svelte"
import { writable } from 'svelte/store'
import PowerForm from './components/PowerForm.svelte';
import Button from './components/Button.svelte';
import PowerPanel from './components/PowerPanel.svelte';
import AppControls from "./AppControls.svelte"
import StyleController from "./StyleController.svelte"
import VirtualList from "./components/VirtualList.svelte"

let record = writable({})

let numElements = 1

let appControls

let toast = {
  title: "Test Popup",
  description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi facilis assumenda, repudiandae soluta vel, ducimus dolore, a facere repellat fugiat aspernatur obcaecati similique. Sint atque eaque excepturi, id iure laboriosam.",
  time: "40s"
}

$: onButtonClick = () => appControls.toastPopup({
  title: "Channel Created",
  description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi facilis assumenda, repudiandae soluta vel, ducimus dolore, a facere repellat fugiat aspernatur obcaecati similique. Sint atque eaque excepturi, id iure laboriosam.",
  time: "4s"
})

let panelBind
let innerPanel
let showTestPanel
let showInnerTestPanel

</script>

<style global windi:preflights:global windi:safelist:global>
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: "Lexend Deca", system-ui;
  }
  html {
    overflow: hidden;
  }
  body {
    overflow: auto;
  }
</style>


<StyleController />
<AppControls bind:controls={appControls}/>

<Router {routes} />
