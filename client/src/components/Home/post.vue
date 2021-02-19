<template>
    <base-card>
        {{feed}}
    </base-card>
</template>

<script>
export default {
    name: "Post",
    props: {
        feed: {
            type: Object,
            required: true,
        }
    }
}
</script>

<style>

</style>