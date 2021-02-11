<template>
    <div class="register">
        <v-text-field
            placeholder="First name"
            outlined
            flat
            dark
        />
        <v-text-field
            placeholder="Last name"
            outlined
            flat
            dark
        />
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

        <v-text-field
            placeholder="Repeat password"
            outlined
            flat
            type="password"
            dark
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
}
</script>

<style>

</style>