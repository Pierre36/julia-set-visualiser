<script>
export default {
  name: 'side-nav',
  props: {
    sidePanelCollapsed: { type: Boolean, default: true }
  },
  emits: ['update:sidePanelCollapsed'],
  methods: {
    collapseSidePanel() {
      this.$emit('update:sidePanelCollapsed', !this.sidePanelCollapsed)
    }
  }
}
</script>

<template>
  <nav id="sideNav">
    <button id="collapseButton" class="icon-button" :class="{ 'sidePanelCollapsed': sidePanelCollapsed }" @click="collapseSidePanel">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 -960 960 960" role="img">
        <title v-if="sidePanelCollapsed">Show side panel</title>
        <title v-else>Collapse side panel</title>
        <path fill="currentColor" fill-rule="evenodd" d="M685-262 487-459q-5-5-7-10t-2-11q0-6 2-11.5t7-10.5l198-198q9-9 21-8.5t21 9.5q9 9 9 21t-9 21L550-480l177 177q9 9 9 20.5t-9 20.5q-9 9-21 9t-21-9Zm-253 0L234-459q-5-5-7-10t-2-11q0-6 2-11.5t7-10.5l198-198q9-9 21-8.5t21 9.5q9 9 9 21t-9 21L297-480l177 177q9 9 9 20.5t-9 20.5q-9 9-21 9t-21-9Z" />
      </svg>
    </button>
  </nav>
</template>

<style scoped>
#sideNav {
  background-color: var(--gray-500);
  width: var(--sideNav-width);
  display: flex;
  flex-direction: column;
}

nav .icon-button {
  --button-color: var(--gray-300);
  --button-color-hover: var(--gray-100);
  --button-color-active: var(--gray-100);
  --button-background-color-hover: transparent;
  --button-background-color-active: transparent;
}

#collapseButton {
  margin-top: auto;
  rotate: 0deg;
  transition: rotate 1000ms;
}

#collapseButton svg {
  rotate: 0deg;
  transition: rotate 250ms;
}

#collapseButton.sidePanelCollapsed svg {
  rotate: 180deg;
}
</style>
