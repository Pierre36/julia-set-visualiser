<script>
import { Configuration } from "../models/Configuration";
import ComboBox from "./ComboBox.vue";
import Toast from "./Toast.vue";

export default {
  name: "MainHeader",
  components: { ComboBox, Toast },
  props: {
    configurations: { type: Object, required: true },
    selectedConfigurationId: { type: String, required: true },
    configuration: { type: Configuration, required: true },
  },
  emits: ["update:selectedConfigurationId"],
  computed: {
    configurationOptions() {
      return Object.values(this.configurations).map((configuration) => ({
        id: configuration.id,
        text: configuration.name,
      }));
    },
  },
  methods: {
    saveConfiguration() {
      localStorage.setItem("customConfiguration", JSON.stringify(this.configuration.toJSON()));
      this.configurations["CUSTOM"].fillWith(this.configuration);
      this.$refs.toast.show();
    },
  },
};
</script>

<template>
  <header>
    <img class="logo" src="/logo.svg" />
    <h1>Julia Set Visualizer</h1>
    <ComboBox
      label="Configuration"
      :options="configurationOptions"
      :selected="selectedConfigurationId"
      @update:selected="(newSelected) => $emit('update:selectedConfigurationId', newSelected)"
    />
    <button
      class="icon-button"
      @click="saveConfiguration"
      :disabled="selectedConfigurationId !== 'CUSTOM'"
    >
      <svg viewBox="0 -960 960 960" role="img">
        <title>Save</title>
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M840-683v503q0 24-18 42t-42 18H180q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h503l157 157Zm-60 27L656-780H180v600h600v-476ZM479.765-245Q523-245 553.5-275.265q30.5-30.264 30.5-73.5Q584-392 553.735-422.5q-30.264-30.5-73.5-30.5Q437-453 406.5-422.735q-30.5 30.264-30.5 73.5Q376-306 406.265-275.5q30.264 30.5 73.5 30.5ZM233-584h358v-143H233v143Zm-53-72v476-600 124Z"
        />
      </svg>
    </button>
    <Toast ref="toast" text="Custom configuration saved" />
  </header>
</template>

<style scoped>
header {
  height: var(--header-height);
  min-width: var(--page-min-width);
  background-color: var(--gray-400);
  display: grid;
  grid-template-columns:
    var(--sideNav-width) auto minmax(min-content, 15rem)
    max-content;
  align-items: center;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

.logo {
  max-height: var(--header-height);
  padding: 0.5rem;
}
</style>
