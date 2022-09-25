<script>
    import SmartInput from "@components/SmartInput.svelte";
    import Icon from "@iconify/svelte";
    import TransitionIcon from "@components/icons/TransitionIcon.svelte";
    import SmartTextBox from "@components/SmartTextBox.svelte";
    import { slide,fly } from "svelte/transition"
    import Button from "@components/Button.svelte";
    import user from "@core/user";

    import { writable } from "svelte/store";
    export let scoped
    $: ({_auth = writable({})} = scoped)

    const passwordRequirements = {
        "Lowercase and uppercase characters": /(?=.*[a-z])(?=.*[A-Z])/,
        "A numeric character": /[\d]/,
        "A special character": /[!@#$%^&*]/,
        "At least 8 characters": /.{8}/
    }

    let passwordStatus = {}
    const checkPasswordRequirements = (password) => {
        let valid = passwordsMatch
        let lines = []
        Object.entries(passwordRequirements).forEach(([label, regex]) => {
            let result = regex.test(password ?? "")
            valid &= result
            lines.push([label, result])
        })

        passwordStatus = { valid, lines }
    }

    $: passwordsMatch, checkPasswordRequirements($_auth.password)

    let confirmPasswordChanged = false
    const markConfirmPassword = () => confirmPasswordChanged = true
    $: passwordsMatch = !!($_auth.password == $_auth.confirmPassword && $_auth.password && $_auth.confirmPassword)

    const register = async () => {
        if (!passwordStatus.valid) return

        await user.register($_auth)
    }
</script>

<div class="text-3xl text-blue-gray-800" in:fly={{x: -100}}>Sign Up</div>
<SmartInput name="username" label="Username" class="!p-2 tracking-widest" />
<div class="flex gap-4">
    <SmartInput name="firstName" label="First Name" class="!p-2" />
    <SmartInput name="lastName" label="Last Name" class="!p-2" />
</div>
<SmartInput name="password" label="Password" type="password" class="!p-2 tracking-widest" autocomplete="new-password" />
<div class="contents" on:change={markConfirmPassword}>
    <SmartInput name="confirmPassword" label="Confirm Password" type="password" class="!p-2 tracking-widest" />
</div>
<div class="h-2">
    {#if !passwordsMatch && confirmPasswordChanged}
    <div transition:fly class="text-red-700 text-xs">Passwords do not match</div>
    {/if}
</div>
<div class="text-sm mt-2 font-light text-gray-400">
    <div class="text-xs text-gray-600 mb-2 font-medium">
        Password must include:
    </div>
    {#each passwordStatus.lines as [label, valid], i}
    <div class="flex ga!p-2 items-center" class:text-primary={valid}>
        
        <TransitionIcon icon={valid ? "ion:checkmark-circle-outline" : "ion:ios-close-circle-outline"} class="w-6 flex-shrink-0"/>
        <SmartTextBox>{label}</SmartTextBox>
        <!-- <div class="transition duration-200">{label}</div> -->
    </div>
    {/each}
</div>
<Button class="mt-4" disabled={!passwordStatus?.valid} onClick={register}>Register</Button>
<!-- <div class="mt-4 bg-primary hover:opacity-75 rounded cursor-pointer text-blue-50 !p-2 text-center filter transition duration-200" class:grayscale-100={!passwordStatus?.valid}>Register</div> -->
<div class="text-xs text-gray-600 font-light">Already have an account? <a href="login">Sign in here</a></div>