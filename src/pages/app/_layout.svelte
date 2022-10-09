<script>
import Sidebar from "@components/Sidebar.svelte";
import ChatContainer from "@components/ChatContainer.svelte";
import user from "@core/user"
import { goto } from "@roxi/routify"
import { onMount } from "svelte"

$: if (!$user.loggedIn) $goto("/auth/login")
</script>


<div class="w-full h-full flex flex-col">
    <div class="z-100 h-15 flex items-center justify-between p-4 header shadow">
        <div class="font-semibold text-2xl">SvelteCord</div>
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

<style>
    .header {
        background: linear-gradient(180deg,hsl(196deg 41% 13%) 61%, hsl(196deg 11% 19%));
        color: white;
    }
</style>