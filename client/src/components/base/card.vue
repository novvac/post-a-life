<template>
    <v-card
        v-bind="$attrs"
        v-on="$listeners"
        :style="'border-radius:' + rounded + 'px'"
        flat
    >
        <v-card-title v-if="hasTitle || hasAction" class="body-2 font-weight-bold d-flex justify-space-between align-center">
            <div v-if="hasTitle">
                <slot name="title"/>
            </div>

            <slot v-if="hasAction" name="action"/>
        </v-card-title>

        <v-divider v-if="hasTitle || hasAction"></v-divider>

        <v-card-subtitle v-if="hasSubtitle">
            <slot name="subtitle"/>
        </v-card-subtitle>

        <v-card-text>
            <slot/>
        </v-card-text>

        <v-card-actions class="pa-0" v-if="hasOtherAction">
            <slot name="other-action"/>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: "BaseCard",
    props: {
        rounded: {
            type: Number,
            default: 16,
        }
    },
    computed: {
        hasTitle() {
            return !!this.$slots['title'];
        },
        hasAction() {
            return !!this.$slots['action'];
        },
        hasSubtitle() {
            return !!this.$slots['subtitle'];
        },
        hasOtherAction() {
            return !!this.$slots['other-action'];
        }
    }
}
</script>

<style>

</style>