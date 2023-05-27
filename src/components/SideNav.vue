<script>
import SideNavMenu from './sideNavMenu.vue';

export default {
  name: 'side-nav',
  components: { SideNavMenu },
  props: {
    sidePanelCollapsed: { type: Boolean, default: true },
    currentPanel: { type: String, default: '' },
    panels: { type: Array, default: [] }
  },
  emits: ['update:sidePanelCollapsed', 'update:currentPanel'],
  methods: {
    updateSidePanelCollapsed() {
      this.$emit('update:sidePanelCollapsed', !this.sidePanelCollapsed)
    },
    updateCurrentPanel(newPanel) {
      this.$emit('update:currentPanel', newPanel)
    }
  }
}
</script>

<template>
  <div id="sideNav" :class="{ 'sidePanelCollapsed': sidePanelCollapsed }">
    <SideNavMenu :currentPanel="currentPanel" :panels="panels" :sidePanelCollapsed="sidePanelCollapsed"
      @update:sidePanelCollapsed="updateSidePanelCollapsed" @update:currentPanel="updateCurrentPanel" />
    <button id="collapseButton" class="icon-button" @click="updateSidePanelCollapsed">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 -960 960 960" role="img">
        <title v-if="sidePanelCollapsed">Show side panel</title>
        <title v-else>Collapse side panel</title>
        <path fill="currentColor" fill-rule="evenodd"
          d="M685-262 487-459q-5-5-7-10t-2-11q0-6 2-11.5t7-10.5l198-198q9-9 21-8.5t21 9.5q9 9 9 21t-9 21L550-480l177 177q9 9 9 20.5t-9 20.5q-9 9-21 9t-21-9Zm-253 0L234-459q-5-5-7-10t-2-11q0-6 2-11.5t7-10.5l198-198q9-9 21-8.5t21 9.5q9 9 9 21t-9 21L297-480l177 177q9 9 9 20.5t-9 20.5q-9 9-21 9t-21-9Z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
#sideNav {
  --collapseButton-height: var(--sideNav-width);
  background-color: var(--gray-500);
  width: var(--sideNav-width);
}

#sideNav>>>.icon-button {
  --button-color: var(--gray-300);
  --button-color-hover: var(--gray-100);
  --button-color-active: var(--gray-100);
  --button-background-color-hover: transparent;
  --button-background-color-active: transparent;
}

#sideNav>>>.icon-button svg {
  width: 2rem;
  height: 2rem;
}

#collapseButton {
  height: var(--collapseButton-height);
  rotate: 0deg;
  transition: rotate 1000ms;
}

#collapseButton svg {
  rotate: 0deg;
  transition: rotate 250ms;
}

#sideNav.sidePanelCollapsed #collapseButton svg {
  rotate: 180deg;
}
</style>
