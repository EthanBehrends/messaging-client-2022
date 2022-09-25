<script>


let colorPrimary = "#1c57c4"
colorPrimary = "#2563eb"
window.setPrimaryColor = (color) => colorPrimary = color

$: bodyStyles = [
    `--color-primary: ${colorPrimary}`
]

$: document.body.setAttribute("style", bodyStyles.join("; "))
</script>