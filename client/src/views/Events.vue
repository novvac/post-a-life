<template>
    <div class="events ma-5">
        <div class="hero">
            <p class="ma-0 caption">
                Najpopularniejsze wśród znajomych
            </p>
            <span class="font-weight-bold display-1">
                Wydarzenia
            </span>

            <div class="hero-box mt-5">
                <event-hero style="right: 0;"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Events",
    components: {
        EventHero: () => import('@/components/Events/hero'),
    }
}
</script>

<style lang="scss">
.hero-box {

}
</style>