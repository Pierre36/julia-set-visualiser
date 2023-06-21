<script>
import TopNav from "./components/TopNav.vue";
import SideBar from "./components/SideBar.vue";
import AnimationFrame from "./components/AnimationFrame.vue";
import { Configuration } from "./models/Configuration";

export default {
  name: "App",
  components: { TopNav, SideBar, AnimationFrame },
  data() {
    return {
      configurations: { 0: Configuration.defaultConfiguration() },
      selectedConfigurationId: "0",
      configuration: Configuration.defaultConfiguration(),
    };
  },
  created() {
    this.getConfigurations();
  },
  methods: {
    updateConfiguration(newSelectedId) {
      this.selectedConfigurationId = newSelectedId;
      this.configuration.fillWith(this.configurations[newSelectedId]);
    },
    async getConfigurations() {
      const { default: json } = await import("./assets/configurations.json");
      json.forEach((jsonConfiguration) => {
        this.configurations[jsonConfiguration.id] =
          Configuration.fromJSON(jsonConfiguration);
      });
    },
  },
};
</script>

<template>
  <TopNav
    :configurations="configurations"
    :selectedConfigurationId="selectedConfigurationId"
    @update:selectedConfigurationId="
      (newSelectedId) => updateConfiguration(newSelectedId)
    "
  />
  <main>
    <SideBar :configuration="configuration" />
    <AnimationFrame :configuration="configuration" />
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
