<script>
import TopNav from "./components/TopNav.vue";
import SideBar from "./components/SideBar.vue";
import AnimationFrame from "./components/AnimationFrame.vue";
import { Complex } from "./models/Complex";
import { ComplexCircle } from "./models/ComplexCircle";
import { ComplexLine } from "./models/ComplexLine";
import { Polynomial } from "./models/Polynomial";
import { Attractor } from "./models/Attractor";

export default {
  name: "App",
  components: { TopNav, SideBar, AnimationFrame },
  data() {
    return {
      parameters: {
        paused: false,
        resolutionScale: 1,
        coordinatesScale: 2,
        polynomial: new Polynomial({
          0: new ComplexCircle(new Complex(0, 0), 1, 5000),
          2: new Complex(1, 0),
        }),
        functionType: "DEFAULT",
        juliaHSV: [210, 0, 1],
        defaultAttractor: new Attractor(null, 210.0, 0.11, 0.0, 0.26, 1.4),
        infinityAttractor: new Attractor(null, 210.0, 0.11, 0.0, 0.26, 1.4),
        attractors: [],
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
