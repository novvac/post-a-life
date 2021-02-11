<template>
    <div class="login">
        <v-text-field
            placeholder="Username"
            outlined
            flat
            dark
        />
        <v-text-field
            placeholder="Password"
            outlined
            flat
            type="password"
            dark
        />

        <v-btn icon large dark>
            <v-icon>mdi-login</v-icon>
        </v-btn>

        <a class="d-block" href="register">załóż konto</a>
    </div>
</template>

<script>
export default {
    name: "Login",
}
</script>

<style>

</style>