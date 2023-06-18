<script>
import FormSelect from "./FormSelect.vue";

export default {
  name: "TopNav",
  components: { FormSelect },
  data() {
    return {
      configurationOptions: [{ id: 0, text: "Default" }],
      selectedConfiguration: 0,
    };
  },
};
</script>

<template>
  <div id="topNav">
    <img class="logo" src="../../public/logo.svg" />
    <h1>Julia Set Visualizer</h1>
    <FormSelect
      :options="configurationOptions"
      :selected="selectedConfiguration"
    />
  </div>
</template>

<style scoped>
#topNav {
  height: var(--topNav-height);
  background-color: var(--gray-400);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

h1 {
  flex-grow: 1;
}

.logo {
  max-height: var(--topNav-height);
  padding: 0.5rem;
}
</style>
