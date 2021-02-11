import Vue from 'vue'
import VueRouter from 'vue-router'

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
      }
    ]
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/views/Auth.vue"),
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
  {
    path: "*",
    redirect: "/app",
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
