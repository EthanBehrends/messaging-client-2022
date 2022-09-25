<script>
    export let record = {}

    let _record = {subscribe: () => () => {}}
    if (record.subscribe) _record = record
</script>

{#if record.subscribe}
    <slot record={$_record} />
{:else}
    <slot {record}/>
{/if}