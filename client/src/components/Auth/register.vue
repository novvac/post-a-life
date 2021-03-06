<template>
    <div class="register">
        <v-text-field
            placeholder="First name"
            outlined
            flat
            dark
            v-model="credentials.firstName"
            :error="Boolean(errors.firstName)"
            :error-messages="errors.firstName"
        />
        <v-text-field
            placeholder="Last name"
            outlined
            flat
            dark
            v-model="credentials.lastName"
            :error="Boolean(errors.lastName)"
            :error-messages="errors.lastName"
        />
        <v-text-field
            placeholder="Email"
            outlined
            flat
            dark
            v-model="credentials.email"
            :error="Boolean(errors.email)"
            :error-messages="errors.email"
        />
        <v-text-field
            placeholder="Password"
            outlined
            flat
            type="password"
            dark
            v-model="credentials.password"
            :error="Boolean(errors.password)"
            :error-messages="errors.password"
        />

        <v-text-field
            placeholder="Repeat password"
            outlined
            flat
            type="password"
            dark
            v-model="credentials.rePassword"
            :error="Boolean(errors.rePassword)"
            :error-messages="errors.rePassword"
        />

        <v-btn icon large dark @click="signUp">
            <v-icon>mdi-check</v-icon>
        </v-btn>

        <p v-if="msg">{{msg}}</p>

        <a class="d-block" href="login">zaloguj się</a>
    </div>
</template>

<script>
export default {
    name: "Register",
    data() {
        return {
            credentials: {},
            errors: {},
            msg: "",
        }
    },
    methods: {
        signUp() {
            this.errors = {};
            this.msg = "";

            const url = "auth/register";
            this.$http.post(url, this.credentials)
                .then((res) => {
                    this.msg = "Konto zostało utworzone! Możesz się teraz zalogować!";
                    this.credentials = {};
                })
                .catch((e) => {
                    this.errors = e.response.data.errors;
                })
        }
    }
}
</script>

<style>

</style>