import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'

Vue.use(VueRouter)

const routes = [
  {
    path: '/app',
    name: 'Accessed',
    component: () => import('@/views/Accessed.vue'),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import('@/views/Home.vue'),
      },
      {
        path: "friends",
        name: "Friends",
        component: () => import('@/views/Friends.vue'),
      },
      {
        path: "user/:id",
        name: "User",
        component: () => import("@/views/User.vue"),
      }
    ]
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/views/Auth.vue"),
    beforeEnter(to, from, next) {
      if(VueCookies.get("token")) {
        next({name: "Accessed"});
      } else {
        next();
      }
    },
    redirect: "/auth/login",
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import('@/components/Auth/login.vue'),
      },
      {
        path: "register",
        name: "Register",
        component: () => import('@/components/Auth/register.vue'),
      }
    ]
  },
  // {
  //   path: "*",
  //   redirect: "/app",
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // user is logged?
  const tokenExist = Boolean(VueCookies.get("token"));
  if(!tokenExist && to.fullPath.slice(0,4) === "/app") {
    next({name: "Login"});
  } else {
    next();
  }
})

export default router
