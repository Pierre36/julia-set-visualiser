<script>
import FunctionPanel from "./FunctionPanel.vue";
import ColorsPanel from "./ColorsPanel.vue";
import AdvancedSettingsPanel from "./AdvancedSettingsPanel.vue";

export default {
  name: "SidePanel",
  components: { FunctionPanel, ColorsPanel, AdvancedSettingsPanel },
  props: {
    currentPanel: { type: String, required: true },
    parameters: { type: Object, required: true },
    collapsed: { type: Boolean, default: true },
  },
  methods: {
    updateFunctionType(newFunctionType) {
      this.parameters.functionType = newFunctionType;
    },
  },
};
</script>

<template>
  <div id="sidePanel" :class="{ collapsed: collapsed }">
    <FunctionPanel
      v-if="currentPanel == 'FUNCTION'"
      :functionType="parameters.functionType"
      :polynomial="parameters.polynomial"
      @update:functionType="updateFunctionType"
    />
    <ColorsPanel v-if="currentPanel == 'COLORS'" />
    <AdvancedSettingsPanel v-if="currentPanel == 'ADVANCED'" />
  </div>
</template>

<style>
#sidePanel {
  --divider-height: 1px;
  --divider-color: var(--gray-350);
  position: absolute;
  display: flex;
  flex-direction: column;
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

#sidePanel header {
  padding: 0.5rem;
  border-bottom: calc(var(--divider-height) * 2) solid var(--divider-color);
}

#sidePanel .panelContent {
  overflow-y: auto;
}

#sidePanel section {
  padding: 0.5rem;
  border-bottom: var(--divider-height) solid var(--divider-color);
}

#sidePanel section:last-of-type {
  border-bottom: none;
  flex-grow: 1;
}

#sidePanel section .content {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 0.25rem;
  padding-left: 0.25rem;
}
</style>
