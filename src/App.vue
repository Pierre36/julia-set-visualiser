<script>
import TopNav from "./components/TopNav.vue";
import SideBar from "./components/SideBar.vue";
import AnimationFrame from "./components/AnimationFrame.vue";
import { Configuration } from "./models/Configuration";
import { Polynomial } from "./models/Polynomial";
import { Attractor } from "./models/Attractor";

export default {
  name: "App",
  components: { TopNav, SideBar, AnimationFrame },
  data() {
    return {
      configurations: {
        DEFAULT: Configuration.defaultConfiguration(),
        CUSTOM: new Configuration(
          "CUSTOM",
          "Custom",
          1,
          1,
          new Polynomial(),
          "DEFAULT",
          [0, 0, 0],
          new Attractor(null, 0, 0, 0, 0, 0),
          new Attractor(null, 0, 0, 0, 0, 0),
          []
        ),
      },
      selectedConfigurationId: "DEFAULT",
      configuration: Configuration.defaultConfiguration("CUSTOM", "Custom"),
    };
  },
  created() {
    this.getJSONConfigurations();
    this.getStorageConfiguration();
  },
  methods: {
    updateConfiguration(newSelectedId) {
      this.selectedConfigurationId = newSelectedId;
      this.configuration.fillWith(this.configurations[newSelectedId]);
    },
    getStorageConfiguration() {
      const localConfiguration = localStorage.getItem("customConfiguration");
      if (localConfiguration != null) {
        this.configurations["CUSTOM"] = Configuration.fromJSON(JSON.parse(localConfiguration));
        this.selectedConfigurationId = "CUSTOM";
        this.updateConfiguration(this.selectedConfigurationId);
      }
    },
    switchToCustomConfiguration() {
      this.selectedConfigurationId = "CUSTOM";
    },
    async getJSONConfigurations() {
      const { default: json } = await import("./assets/configurations.json");
      json.forEach((jsonConfiguration) => {
        this.configurations[jsonConfiguration.id] = Configuration.fromJSON(jsonConfiguration);
      });
    },
  },
};
</script>

<template>
  <TopNav
    :configurations="configurations"
    :selectedConfigurationId="selectedConfigurationId"
    :configuration="configuration"
    @update:selectedConfigurationId="(newSelectedId) => updateConfiguration(newSelectedId)"
  />
  <main>
    <SideBar :configuration="configuration" @change="switchToCustomConfiguration" />
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
