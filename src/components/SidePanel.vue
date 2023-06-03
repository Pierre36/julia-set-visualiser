<script>
import FunctionPanel from './FunctionPanel.vue';
import ColorsPanel from './ColorsPanel.vue';
import AdvancedSettingsPanel from './AdvancedSettingsPanel.vue';

export default {
  name: "side-panel",
  components: { FunctionPanel, ColorsPanel, AdvancedSettingsPanel },
  props: {
    collapsed: { type: Boolean, default: true },
    currentPanel: { type: String, default: null },
    parameters: { type: Object, default: null }
  }
}
</script>

<template>
  <div id="sidePanel" :class="{ 'collapsed': collapsed }">
    <FunctionPanel v-if="currentPanel == 'FUNCTION'" />
    <ColorsPanel v-if="currentPanel == 'COLORS'" />
    <AdvancedSettingsPanel v-if="currentPanel == 'ADVANCED'" />
  </div>
</template>

<style scoped>
#sidePanel {
  position: absolute;
  width: var(--sidePanel-width);
  height: 100%;
  background-color: var(--gray-600);
  transition: margin-left 250ms ease-in-out;
  left: var(--sideNav-width);
  margin-left: 0;
  z-index: 1;
}

#sidePanel.collapsed {
  margin-left: calc(-1 * var(--sidePanel-width));
}

@media (min-width: 1000px) {
  #sidePanel {
    position: initial;
  }
}
</style>
