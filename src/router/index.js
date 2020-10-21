import Vue from "vue";
import VueRouter from "vue-router";
import Characters from "@/components/Characters";
import Character from "@/components/Character";
import Comics from "@/components/Comics";
import Comic from "@/components/Comic";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "Home",
    component: Characters,
  },
  {
    path: "/character/:id",
    name: "Character",
    component: Character,
  },
  {
    path: "/comics",
    name: "Comics",
    component: Comics,
  },
  {
    path: "/comic/:id",
    name: "Comic",
    component: Comic,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
