<template>
    <div class="login">
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

        <v-btn icon large dark @click="signIn()">
            <v-icon>mdi-login</v-icon>
        </v-btn>

        <p v-if="msg">{{msg}}</p>

        <a class="d-block" href="register">załóż konto</a>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            credentials: {},
            errors: {},
            msg: "",
        }
    },
    methods: {
        signIn() {
            this.errors = {};
            this.msg = "";

            const url = "http://192.168.43.5:3000/api/auth/login";
            this.$http.post(url, this.credentials)
                .then((res) => {
                    this.msg = res.data.msg;
                    this.$cookies.set("token", res.data.token);
                    this.$router.push("/app");
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