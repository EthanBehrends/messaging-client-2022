<script>
import Sidebar from "@components/Sidebar.svelte";
import ChatContainer from "@components/ChatContainer.svelte";
import user from "@core/user"
import { goto } from "@roxi/routify"
import { onMount } from "svelte"
import { fetchInitialData } from "@core/messaging"

$: if (!$user.loggedIn) $goto("/auth/login")

onMount(() => {
    fetchInitialData()
})
</script>


<div class="w-full h-full flex flex-col">
    <div class="z-100 h-15 flex items-center justify-between p-4 bg-indigo-100 shadow">
        <div class="font-semibold text-lg text-cool-gray-800">SvelteCord</div>
        <div class="text-sm">Hello, {$user.firstName}</div>
    </div>

    <div class="flex-grow flex overflow-hidden">
        <div class="z-90 w-60 flex-shrink-0 shadow">
            <Sidebar />
        </div>
        <div class="h-full w-full relative">
            <slot />
        </div>
    </div>
</div>