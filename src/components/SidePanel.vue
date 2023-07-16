<script>
import FunctionPanel from "./FunctionPanel.vue";
import ColorsPanel from "./ColorsPanel.vue";
import AdvancedSettingsPanel from "./AdvancedSettingsPanel.vue";

export default {
  name: "SidePanel",
  components: { FunctionPanel, ColorsPanel, AdvancedSettingsPanel },
  props: {
    currentPanel: { type: String, required: true },
    configuration: { type: Object, required: true },
    collapsed: { type: Boolean, default: true },
  },
  emits: ["change"],
};
</script>

<template>
  <div id="sidePanel" :class="{ collapsed: collapsed }">
    <FunctionPanel
      v-if="currentPanel == 'FUNCTION'"
      :fractalFunction="configuration.fractalFunction"
      @change="$emit('change')"
    />
    <ColorsPanel
      v-if="currentPanel == 'COLORS'"
      :juliaHSV="configuration.juliaHSV"
      :defaultAttractor="configuration.defaultAttractor"
      :infinityAttractor="configuration.infinityAttractor"
      :attractors="configuration.attractors"
      @change="$emit('change')"
    />
    <AdvancedSettingsPanel
      v-if="currentPanel == 'ADVANCED'"
      :configuration="configuration"
      @change="$emit('change')"
    />
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
  z-index: 2;
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
  flex-grow: 1;
}

#sidePanel section {
  padding: 0.5rem;
  border-bottom: var(--divider-height) solid var(--divider-color);
}

#sidePanel section .sectionHeader {
  margin-bottom: 0.5rem;
}

#sidePanel section:last-of-type {
  border-bottom: none;
  flex-grow: 1;
}

#sidePanel section .content {
  display: grid;
  grid-template-columns: auto 12rem;
  align-items: center;
  gap: 0.75rem;
  padding-left: 0.25rem;
}

#sidePanel p {
  margin-bottom: 0.5rem;
}

#sidePanel .infoList {
  list-style: inside;
  padding-inline-start: 1rem;
  margin-bottom: 0.75rem;
}

#sidePanel .infoListItemTitle {
  font-weight: 500;
}

#sidePanel li {
  margin-bottom: 0.5rem;
}
</style>
