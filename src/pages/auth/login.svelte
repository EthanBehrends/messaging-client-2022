<script>
    import SmartInput from "../../components/SmartInput.svelte";
    import { fly } from "svelte/transition"
    import Button from "@components/Button.svelte";
    import user from "@core/user";

    import { writable } from "svelte/store";
    export let scoped
    $: ({_auth = writable({})} = scoped)

    const login = async () => {
        await user.login($_auth)
    }
</script>

<div class="text-3xl text-blue-gray-800" in:fly={{x: -100}}>Login</div>
<SmartInput name="username" label="Username" class="p-2" />
<SmartInput name="password" label="Password" type="password" class="p-2 tracking-widest" />
<label class="flex gap-2">
    <input type="checkbox" name="staySignedIn" value="true"/>
    Stay Signed In
</label>
<Button onClick={login} class="mt-4">Log In</Button>
<div class="text-xs text-gray-600 font-light">Don't have an account? <a href="register">Register here</a></div>
