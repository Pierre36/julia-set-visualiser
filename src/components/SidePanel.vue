<script>
export default {
  name: "side-panel",
  props: {
    collapsed: { type: Boolean, default: true }
  }
}
</script>

<template>
  <div id="sidePanel" :class="{ 'collapsed': collapsed }"></div>
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
