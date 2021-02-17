<template>
    <v-menu offset-y centered v-bind="$attrs" v-on="$listeners">
        <template v-slot:activator="{on}">
            <div v-on="on">
                <slot name="activator"/>
            </div>
        </template>

        <div>
            <slot/>
        </div>
    </v-menu>
</template>

<script>
export default {
    name: "BaseMenu",
}
</script>

<style>

</style>