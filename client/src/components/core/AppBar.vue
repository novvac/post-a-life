<template>
    <v-app-bar
        app
        flat
        clipped-left
        clipped-right
        color="white"
        style="border-bottom: 1px solid #cecece !important;"
    >
        <h2>Logo</h2>

        <v-spacer></v-spacer>

        <div class="search-box">
            <v-text-field
                placeholder="Type something to search"
                solo
                outlined
                style="border-radius: 0;"
                append-icon="mdi-magnify"
                clearable
                hide-details
                flat
                dense
                tile
                v-model="searchValue"
                @keyup.enter="search()"
                @click:append="search()"
                @keyup="fastSearch()"
                @click:clear="searchValue = ''"
            />

            <base-card class="result" without-padding :rounded="0" v-if="searchValue.length > 0">                
                <div class="text-center pa-5" v-if="waitingForData">
                    <v-progress-circular
                        indeterminate
                        small
                        color="primary"
                        size="16"
                        width="2"
                        class="mr-2"
                    />

                    <span class="caption">Wyszukiwanie...</span>
                </div>
                
                <v-list dense v-else-if="found.length > 0"> 
                    <v-list-item
                        v-for="user in found"
                        :key="user.short_id"
                        class="py-2"
                        link
                        :to="`/app/user/${user.short_id}`"
                        @click="searchValue = ''"
                    >
                        <v-avatar size="36">
                            <v-img :src="'http://192.168.43.5:3000/uploads/' + user.avatar"/>
                        </v-avatar>

                        <div class="ml-2">
                            <v-list-item-title class="body-2">{{user.firstName}} {{user.lastName}}</v-list-item-title>
                            <v-list-item-subtitle class="caption">@{{user.short_id}}</v-list-item-subtitle>
                        </div>
                    </v-list-item>
                </v-list>

                <p class="ma-0 pa-5" v-else-if="msg">
                    {{msg}}
                </p>

                <p class="ma-0 pa-5" v-else>
                    Przestań pisać aby wyszukać
                </p>
            </base-card>
        </div>

        <v-spacer></v-spacer>

        <div class="d-flex">
            <base-menu
                v-for="action in actions"
                :key="action.icon"
                :close-on-content-click="false"
            >
                <template v-slot:activator>
                    <v-btn icon>
                        <v-badge dot color="error" v-if="action.content.length">
                            <v-icon>mdi-{{action.icon}}</v-icon>
                        </v-badge>
                        <v-icon v-else>mdi-{{action.icon}}</v-icon>
                    </v-btn>
                </template>

                <base-card :rounded="0" without-padding>
                    <v-row class="ma-0 pa-5" align="center" justify="space-between">
                        <span class="title black--text d-block pr-10">
                            {{action.title}}
                        </span>

                        <v-btn icon>
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </v-row>

                    <v-divider></v-divider>

                    <v-list class="pa-0" v-if="action.content.length > 0">
                        <component
                            v-for="item in action.content"
                            :key="item.short_id"
                            :is="action.component"
                            :item="item"
                        />
                    </v-list>

                    <p class="ma-0 pa-5" v-else>
                        Brak danych
                    </p>
                </base-card>
            </base-menu>
        </div>
    </v-app-bar>
</template>

<script>
export default {
    name: "CoreAppBar",
    data() {
        return {
            timeout: null,
            isSearching: false,
            waitingForData: false,

            found: [],
            msg: null,

            searchValue: "",
            actions: [
                {
                    title: "Znajomi",
                    icon: "account-plus-outline",
                    content: [
                        {
                            firstName: "Jan",
                            lastName: "Kowalski",
                            avatar: "default-avatar.png",
                            short_id: "0003",
                        },
                    ],
                    component: () => import('../AppBarComponents/friends'),
                },
                {
                    title: "Powiadomienia",
                    icon: "bell-outline",
                    content: [],
                    component: () => import('../AppBarComponents/notifications'),
                },
                {
                    title: "Wiadomości",
                    icon: "message-text-outline",
                    content: [],
                    component: () => import('../AppBarComponents/chats'),
                }
            ]
        }
    },
    methods: {
        search() {
//TODO: main search redirect
            console.log("searching...");
            // przenieś użytkownika na stronę wyszukiwania zaawansowanego razem
            // z wyszukiwanym hasłem. Następnie przed załadowaniem strony
            // pobierz z serwera dane o haśle i pokaż opcje zaawansowane
        },
        fastSearch() {
            this.found = [];
            this.msg = "";
            this.isSearching = false;
            clearTimeout(this.timeout);

            if(!this.waitingForData) {
                this.timeout = setTimeout(() => {
                    this.isSearching = true;
                }, 250)
            }
        },
    },
    watch: {
        isSearching() {
            if(this.isSearching) {
                this.waitingForData = true;
                this.$http.get("http://192.168.43.5:3000/api/main/fast-search/" + this.searchValue.split(" ").join("_"))
                    .then(res => {
                        this.msg = "";
                        this.found = res.data.data;
                        this.waitingForData = false;
                    })
                    .catch(err => {
                        if(err.response.status === 401) {
                            if(this.$cookies.get("token"))
                                this.$cookies.remove("token");
                            this.$router.push("/auth/login");
                        }

                        this.found = [];
                        this.msg = err.response.data;

                        this.waitingForData = false;
                    })
            }
        }
    }
}
</script>

<style lang="scss">
.search-box {
    position: relative;

    .result {
        position: absolute;
        top: 100%;
        width: 100%;
        left: 0;
        height: auto;
        z-index: 9999;
        border: 1px solid #999;
        border-top: none;
    }
}
</style>