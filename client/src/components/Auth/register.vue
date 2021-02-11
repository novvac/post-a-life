<template>
    <div class="register">
        <v-text-field
            placeholder="First name"
            outlined
            flat
            dark
            v-model="credentials.firstName"
        />
        <v-text-field
            placeholder="Last name"
            outlined
            flat
            dark
            v-model="credentials.lastName"
        />
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

        <v-text-field
            placeholder="Repeat password"
            outlined
            flat
            type="password"
            dark
            v-model="credentials.rePassword"
        />

        <v-btn icon large dark>
            <v-icon>mdi-check</v-icon>
        </v-btn>

        <a class="d-block" href="login">zaloguj się</a>
    </div>
</template>

<script>
export default {
    name: "Register",
    data() {
        return {
            credentials: {},
        }
    }
}
</script>

<style>

</style>