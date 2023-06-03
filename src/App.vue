<script>
import TopNav from "./components/TopNav.vue";
import SideBar from "./components/SideBar.vue";
import AnimationFrame from "./components/AnimationFrame.vue";
import { Complex } from "./models/Complex";
import { complexCircle } from "./animations";

export default {
  name: "App",
  components: { TopNav, SideBar, AnimationFrame },
  data() {
    return {
      parameters: {
        paused: false,
        resolutionScale: 1,
        numeratorDegree: 2,
        numeratorCoefficients: [
          complexCircle(new Complex(0, 0), 1, 5000),
          new Complex(0, 0),
          new Complex(1, 0),
        ],
        denominatorDegree: 0,
        denominatorCoefficients: [new Complex(1, 0)],
        functionType: "DEFAULT",
      },
    };
  },
};
</script>

<template>
  <TopNav />
  <main>
    <SideBar :parameters="parameters" />
    <AnimationFrame :parameters="parameters" />
  </main>
</template>

<style scoped>
main {
  position: relative;
  display: flex;
  height: calc(100vh - var(--topNav-height));
  min-height: var(--page-min-height);
}
</style>
