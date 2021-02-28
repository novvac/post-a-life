<template>
    <div
        class="event-hero pa-5 white--text black"
        :style="{width: breakpoint ? '600px' : '100%'}"
    >
        {{breakpoint}}
    </div>
</template>

<script>
export default {
    name: "EventHero",
    computed: {
        breakpoint() {
            return this.$vuetify.breakpoint.mdAndUp;
        },
    }
}
</script>

<style lang="scss">
.event-hero {
    border-radius: 22px;
    position: absolute;
    height: 100%;
}
</style>