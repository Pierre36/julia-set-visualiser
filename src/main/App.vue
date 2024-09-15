<script lang="ts">
import { defineComponent } from "vue";
import MainHeader from "@/components/MainHeader.vue";
import SideBar from "@/components/SideBar.vue";
import AnimationFrame from "@/components/AnimationFrame.vue";
import Configuration from "@/models/Configuration";

export default defineComponent({
  name: "App",
  components: { MainHeader, SideBar, AnimationFrame },
  data() {
    return {
      configurations: {
        DEFAULT: Configuration.defaultConfiguration(),
        CUSTOM: Configuration.emptyConfiguration("CUSTOM", "Custom"),
      } as Record<string, Configuration>,
      selectedConfigurationId: "DEFAULT",
      configuration: Configuration.defaultConfiguration("", ""),
      animationFrame: null,
    };
  },
  created() {
    this.getJSONConfigurations();
    this.getStorageConfiguration();
  },
  mounted() {
    this.animationFrame = this.$refs.animationFrame as any;
  },
  methods: {
    updateConfiguration(newSelectedId: string) {
      this.selectedConfigurationId = newSelectedId;
      this.configuration.fillWith(this.configurations[newSelectedId]);
      if (this.animationFrame != null) {
        // FIXME Fix when switching to Composition API
        (this.animationFrame as any).resetFractalEngineTime();
      }
      console.debug("[OK] Switched to configuration " + newSelectedId);
    },
    getStorageConfiguration() {
      console.debug("[>>] Loading the local storage configuration...");
      const localConfiguration = localStorage.getItem("customConfiguration");
      if (localConfiguration != null) {
        try {
          let customConfiguration = Configuration.fromJSON(JSON.parse(localConfiguration));
          customConfiguration.id = "CUSTOM";
          customConfiguration.name = "Custom";
          this.configurations["CUSTOM"] = customConfiguration;
          this.selectedConfigurationId = "CUSTOM";
        } catch (error) {
          console.error("[KO] Could not load the local storage configuration: %s", error);
        }
      } else {
        this.selectedConfigurationId = "DEFAULT";
        console.debug("[OK] No local storage found. Switching to default configuration...");
      }
      this.updateConfiguration(this.selectedConfigurationId);
    },
    switchToCustomConfiguration() {
      this.selectedConfigurationId = "CUSTOM";
    },
    async getJSONConfigurations() {
      const { default: json } = await import("@/configurations.json");
      json.forEach((jsonConfiguration) => {
        this.configurations[jsonConfiguration.id] = Configuration.fromJSON(jsonConfiguration);
      });
    },
  },
});
</script>

<template>
  <MainHeader
    :configurations="configurations"
    :selectedConfigurationId="selectedConfigurationId"
    :configuration="configuration as Configuration"
    @update:selectedConfigurationId="(newSelectedId) => updateConfiguration(newSelectedId)"
  />
  <main>
    <SideBar
      :configuration="configuration as Configuration"
      @change="switchToCustomConfiguration"
    />
    <AnimationFrame ref="animationFrame" :configuration="configuration as Configuration" />
  </main>
</template>

<style scoped>
main {
  position: relative;
  display: flex;
  height: calc(100vh - var(--header-height));
  min-height: var(--page-min-height);
  min-width: var(--page-min-width);
}
</style>
