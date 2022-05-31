import { createWebHistory, createRouter } from "vue-router";
//import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Map from "../views/Map.vue";
import NewCompany from "../views/NewCompany.vue";
import Admin from "../views/Admin.vue";
import Main from "../views/Main.vue";
import Landing from "../views/Landing.vue";
import Profile from "../views/Profile.vue";

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/map",
    name: "Map",
    component: Map,
  },
  {
    path: "/new",
    name: "NewCompany",
    component: NewCompany,
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;