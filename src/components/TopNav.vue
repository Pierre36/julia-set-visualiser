<script>
import FormSelect from "./FormSelect.vue";

export default {
  name: "TopNav",
  components: { FormSelect },
  props: {
    configurations: { type: Object, required: true },
    selectedConfigurationId: { type: String, required: true },
  },
  emits: ["update:selectedConfigurationId"],
  computed: {
    configurationOptions() {
      const configurationOptions = [];
      Object.values(this.configurations).forEach((configuration) => {
        configurationOptions.push({
          id: configuration.id,
          text: configuration.name,
        });
      });
      return configurationOptions;
    },
  },
};
</script>

<template>
  <div id="topNav">
    <img class="logo" src="../../public/logo.svg" />
    <h1>Julia Set Visualizer</h1>
    <FormSelect
      :options="configurationOptions"
      :selected="selectedConfigurationId"
      @update:selected="
        (newSelected) => $emit('update:selectedConfigurationId', newSelected)
      "
    />
  </div>
</template>

<style scoped>
#topNav {
  height: var(--topNav-height);
  background-color: var(--gray-400);
  display: grid;
  grid-template-columns: var(--sideNav-width) auto 15rem;
  align-items: center;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

.logo {
  max-height: var(--topNav-height);
  padding: 0.5rem;
}
</style>
