<script>
    import user from "@core/user"


</script>

{#if $user.loading}
    <div class="w-full h-full grid place-items-center">
        Loading
    </div>
{:else}
    <slot />
{/if}