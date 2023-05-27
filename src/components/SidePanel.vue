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
  transition: width 250ms ease-in-out;
  left: var(--sideNav-width);
}

#sidePanel.collapsed {
  width: 0rem;
}

@media (min-width: 1000px) {
  #sidePanel {
    position: initial;
  }
}
</style>
