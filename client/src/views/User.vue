<template>
    <div class="user ma-5">
        <base-card without-padding>
            <profile-banner src="https://papers.co/wallpaper/papers.co-oc25-summer-tree-leaf-vacation-green-nature-29-wallpaper.jpg"/>
            <avatar src="https://i.pinimg.com/originals/bb/0c/07/bb0c074019ee55b098fb023ec53be7fb.png"/>
        
            <div class="pa-5">User content here</div>
        </base-card>
    </div>
</template>

<script>
export default {
    name: "User",
    components: {
        profileBanner: () => import('@/components/User/profileBanner'),
        avatar: () => import("@/components/User/avatar"),
    },
    created() {
        console.log("loading user....");
    }
}
</script>

<style>

</style>