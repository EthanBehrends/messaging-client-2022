<script context="module" lang="ts">
    const LS_PREFIX = "PowerIcon-"
    const ICONIFY_URL = "https://api.iconify.design"

    const aliases = {
        "edit": "mdi-icon:edit"
    }

    const getIcon = async (iconName: string): Promise<string> => {
        if (aliases[iconName]) {
            iconName = aliases[iconName]
        }

        let iconFromCache = getIconFromCache(iconName)
        if (iconFromCache) return iconFromCache

        let iconData = await fetchIcon(iconName)

        return iconData
    }

    const getIconFromCache = (iconName: string): string => localStorage[`${LS_PREFIX}${iconName}`]
    const cacheIcon = (iconName: string, iconData: string): void => {
        localStorage[`${LS_PREFIX}${iconName}`] = iconData
    }

    const fetchIcon = async (iconName: string): Promise<string> => {
        if (!iconName.includes(":")) return ""
        let urlSuffix = iconName.replace(":", ".json?icons=")
        let request = await fetch(`${ICONIFY_URL}/${urlSuffix}`)
        let resp = await request.json()

        Object.entries(resp.icons).forEach(([iconName, { body }]: [string, { body: string }]) => cacheIcon(`${resp.prefix}:${iconName}`, body)) 

        return resp.icons[iconName.match(/(?=:).*/)[0]].body
    }
</script>

<script>
    export let name = "ant-design:question-circle-twotone"
    export let size = "1.25rem"

    let iconData = ""
    const setIconData = async (n) => {
        iconData = await getIcon(n)
    }

    $: setIconData(name)

    $: console.log({iconData})
</script>

<svg height={size} width={size}>{@html iconData}</svg>
<!-- <ContentBox width="">
</ContentBox> -->