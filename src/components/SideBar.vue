<script>
import SideNav from './SideNav.vue'
import SidePanel from './SidePanel.vue'

export default {
  name: 'side-bar',
  components: { SideNav, SidePanel },
  data() {
    return {
      sidePanelCollapsed: true,
      currentPanel: 'FUNCTION',
      panels: [
        {
          'id': 'FUNCTION',
          'name': 'Function',
          'icon': 'M402-240v-60h59l121-139-121-141h-74l-71 366q-8 45-34 69.5T215-120q-41 0-68.5-24T119-204q0-27 15-43.5t39-16.5q21 0 34.5 12t13.5 32q0 11-4.5 20.5T204-184q4 2 8.5 3t9.5 1q13 0 22-12.5t13-32.5l69-355H200v-60h137l21-106q9-45 36-69.5t67-24.5q41 0 67.5 24t26.5 60q0 27-15 43.5T501-696q-20 0-34-11.5T453-738q0-10 4-19.5t10-15.5q-2-2-6-3.5t-8-1.5q-13 0-22.5 12T417-735l-18 95h189v60h-47l83 96 78-96h-48v-60h186v60h-58L662-439l120 139h58v60H654v-60h48l-80-93-82 93h48v60H402Z'
        },
        {
          'id': 'COLORS',
          'name': 'Colors',
          'icon': 'M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-85 32-158t87.5-127q55.5-54 130-84.5T489-880q79 0 150 26.5T763.5-780q53.5 47 85 111.5T880-527q0 108-63 170.5T650-294h-75q-18 0-31 14t-13 31q0 27 14.5 46t14.5 44q0 38-21 58.5T480-80Zm0-400Zm-233 26q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm126-170q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm214 0q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm131 170q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15ZM480-140q11 0 15.5-4.5T500-159q0-14-14.5-26T471-238q0-46 30-81t76-35h73q76 0 123-44.5T820-527q0-132-100-212.5T489-820q-146 0-247.5 98.5T140-480q0 141 99.5 240.5T480-140Z'
        },
        {
          'id': 'ADVANCED',
          'name': 'Advanced settings',
          'icon': 'M150-202q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150-262h187q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T337-202H150Zm0-496q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150-758h353q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T503-698H150Zm306.825 578Q444-120 435.5-128.625T427-150v-165q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T487-315v53h323q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T810-202H487v52q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625Zm-120-248Q324-368 315.5-376.625T307-398v-52H150q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150-510h157v-54q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T367-564v166q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625ZM457-450q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T457-510h353q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T810-450H457Zm165.825-165Q610-615 601.5-623.625T593-645v-165q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T653-810v52h157q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T810-698H653v53q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625Z'
        }
      ]
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
    },
    updateCurrentPanel(newPanel) {
      this.currentPanel = newPanel;
    }
  }
}
</script>

<template>
  <div id="sideBar">
    <SideNav :currentPanel="currentPanel" :panels="panels" :sidePanelCollapsed="sidePanelCollapsed"
      @update:sidePanelCollapsed="updateSidePanelCollapsed" @update:currentPanel="updateCurrentPanel" />
    <SidePanel :collapsed="sidePanelCollapsed" />
  </div>
</template>

<style scoped>
#sideBar {
  display: flex;
}
</style>
