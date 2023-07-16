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
      configurations: {
        DEFAULT: Configuration.defaultConfiguration(),
        CUSTOM: Configuration.emptyConfiguration("CUSTOM", "Custom"),
      },
      selectedConfigurationId: "DEFAULT",
      configuration: Configuration.emptyConfiguration("", ""),
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
        try {
          let customConfiguration = Configuration.fromJSON(JSON.parse(localConfiguration));
          customConfiguration.id = "CUSTOM";
          customConfiguration.name = "Custom";
          this.configurations["CUSTOM"] = customConfiguration;
          this.selectedConfigurationId = "CUSTOM";
        } finally {
          this.updateConfiguration(this.selectedConfigurationId);
        }
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
  min-width: var(--page-min-width);
}
</style>
