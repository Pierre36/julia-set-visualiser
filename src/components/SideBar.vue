<script>
import SideNav from './SideNav.vue'
import SidePanel from './SidePanel.vue'

export default {
  name: 'side-bar',
  components: { SideNav, SidePanel },
  data() {
    return {
      sidePanelCollapsed: true
    }
  },
  created() {
    const rawSidePanelCollapsed = localStorage.getItem('sidePanelCollapsed');
    if (rawSidePanelCollapsed != null) {
      this.sidePanelCollapsed = JSON.parse(rawSidePanelCollapsed);
    }
  },
  methods: {
    updateSidePanelCollapsed(collapsed) {
      this.sidePanelCollapsed = collapsed;
      localStorage.setItem('sidePanelCollapsed', JSON.stringify(collapsed));
    }
  }
}
</script>

<template>
  <div id="sideBar">
    <SideNav :sidePanelCollapsed="sidePanelCollapsed" @update:sidePanelCollapsed="updateSidePanelCollapsed" />
    <SidePanel :collapsed="sidePanelCollapsed" />
  </div>
</template>

<style scoped>
#sideBar {
  display: flex;
}
</style>
