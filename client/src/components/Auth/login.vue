<template>
    <div class="login">
        <v-text-field
            placeholder="Email"
            outlined
            flat
            dark
            v-model="credentials.email"
        />
        <v-text-field
            placeholder="Password"
            outlined
            flat
            type="password"
            dark
            v-model="credentials.password"
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
    data() {
        return {
            credentails: {},
        }
    }
}
</script>

<style>

</style>