<template>
    <v-card
        v-bind="$attrs"
        v-on="$listeners"
        :style="styles"
        flat
    >
        <v-card-title v-if="hasTitle || hasAction" class="body-2 font-weight-bold d-flex justify-space-between align-center">
            <div v-if="hasTitle">
                <slot name="title"/>
            </div>

            <base-menu>
                <template v-slot:activator>
                    <slot v-if="hasAction" name="action"/>
                </template>

                <base-card :rounded="0">
                    Content here
                </base-card>
            </base-menu>
        </v-card-title>

        <v-divider v-if="hasTitle || hasAction"></v-divider>

        <v-card-subtitle v-if="hasSubtitle">
            <slot name="subtitle"/>
        </v-card-subtitle>

        <v-card-text :class="[dense ? 'px-3 py-2' : undefined, withoutPadding ? 'pa-0' : undefined]">
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
        },
        dense: {
            type: Boolean,
            default: false,
        },
        withoutPadding: {
            type: Boolean,
            default: false,
        },
        bordered: {
            type: Boolean,
            default: false,
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
        },
        styles() {
            let styles = {};

            styles.borderRadius = this.rounded + "px";
            if(this.bordered)
                styles.border = "1px solid #ddd";

            return styles;
        }
    }
}
</script>

<style>

</style>