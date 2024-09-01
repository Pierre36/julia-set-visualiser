<script>
import FunctionPanel from "./FunctionPanel.vue";
import ColorsPanel from "./ColorsPanel.vue";
import AdvancedSettingsPanel from "./AdvancedSettingsPanel.vue";
import RandomPanel from "./RandomPanel.vue";

export default {
  name: "SidePanel",
  components: { FunctionPanel, ColorsPanel, AdvancedSettingsPanel, RandomPanel },
  props: {
    currentPanel: { type: String, required: true },
    configuration: { type: Object, required: true },
    collapsed: { type: Boolean, default: true },
  },
  emits: ["change"],
};
</script>

<template>
  <Transition name="panel-slide">
    <div id="side-panel" v-show="!collapsed" role="tabpanel">
      <FunctionPanel
        v-show="currentPanel == 'FUNCTION'"
        :fractalFunction="configuration.fractalFunction"
        @change="$emit('change')"
      />
      <ColorsPanel
        v-show="currentPanel == 'COLORS'"
        :juliaHSV="configuration.juliaHSV"
        :defaultAttractor="configuration.defaultAttractor"
        :infinityAttractor="configuration.infinityAttractor"
        :attractors="configuration.attractors"
        @change="$emit('change')"
      />
      <AdvancedSettingsPanel
        v-show="currentPanel == 'ADVANCED'"
        :configuration="configuration"
        @change="$emit('change')"
      />
      <RandomPanel
        v-show="currentPanel == 'RANDOM'"
        :configuration="configuration"
        @change="$emit('change')"
      />
    </div>
  </Transition>
</template>

<style>
#side-panel {
  --divider-height: 1px;
  --divider-color: var(--gray-350);
  position: absolute;
  display: flex;
  flex-direction: column;
  width: var(--sidePanel-width);
  height: 100%;
  background-color: var(--gray-600);
  left: var(--sideNav-width);
  z-index: 2;
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: margin-left 250ms ease-in-out;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  margin-left: calc(-1 * var(--sidePanel-width));
}

@media (min-width: 1000px) {
  #side-panel {
    position: initial;
  }
}

#side-panel .panel-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

#side-panel header {
  padding: 0.5rem;
  border-bottom: calc(var(--divider-height) * 2) solid var(--divider-color);
}

#side-panel .panel-content {
  overflow-y: auto;
  flex-grow: 1;
  border: 2px solid transparent;
  outline: none;
  border-radius: 0.1rem;
}

#side-panel .panel-content:focus-visible {
  border-color: var(--blue-100);
}

#side-panel section {
  padding: 0.5rem;
  border-bottom: var(--divider-height) solid var(--divider-color);
}

#side-panel section .section-header {
  margin-bottom: 0.5rem;
}

#side-panel section:last-of-type {
  border-bottom: none;
  flex-grow: 1;
}

#side-panel section .content {
  display: grid;
  grid-template-columns: auto 12rem;
  align-items: center;
  gap: 0.75rem;
  padding-left: 0.25rem;
}

#side-panel section .content.one-column {
  grid-template-columns: auto;
}

#side-panel p {
  margin-bottom: 0.5rem;
}

#side-panel .info-list {
  list-style: inside;
  padding-inline-start: 1rem;
  margin-bottom: 0.75rem;
}

#side-panel .info-list-item-title {
  font-weight: 500;
}
</style>
