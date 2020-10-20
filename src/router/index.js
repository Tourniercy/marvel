import Vue from "vue";
import VueRouter from "vue-router";
import Characters from "@/components/Characters";
import Character from "@/components/Character";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Characters,
  },
  {
    path: "/character",
    name: "Character",
    component: Character,
  },
  {
    path: "/comics",
    name: "Comics",
    component: Characters,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
