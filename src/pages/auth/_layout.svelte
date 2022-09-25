<script>
    import PowerForm from "@components/PowerForm.svelte";
    import { writable } from "svelte/store"
    import user from "@core/user"
    import { goto } from "@roxi/routify";

    const _auth = writable({})

    $: if ($_auth.username) $_auth.username = $_auth.username.replace(/[^\w\.\-\_]/g, "")

    $: if ($user.loggedIn) {
        console.log("Logged in")
        $goto("/app")
    }
    let height
</script>

<style>

</style>

<div class="w-full h-full bg-light-600 flex flex-wrap items-center gap-4 justify-center relative">
    <div class="shadow w-80 rounded-lg bg-light-50 overflow-hidden">
        <div class="h-4 w-full bg-primary"></div>
        <div class="transition-all duration-200 ease-in-out overflow-hidden" style="height: {height}px">
            <div class="p-8 flex flex-col gap-2" bind:offsetHeight={height}>
                <PowerForm _record={_auth}>
                    <slot scoped={{_auth}} />
                </PowerForm>
            </div>
        </div>
    </div>
    <div class="absolute bottom-5 right-5 text-xl text-gray-500">Built by Ethan Behrends</div>
</div>