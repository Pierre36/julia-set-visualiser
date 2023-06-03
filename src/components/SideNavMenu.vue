<script>
export default {
  name: "SideNavMenu",
  props: {
    currentPanel: { type: String, required: true },
    panels: { type: Array, required: true },
    sidePanelCollapsed: { type: Boolean, default: true },
  },
  emits: ["update:sidePanelCollapsed", "update:currentPanel"],
  data() {
    return {
      moreMenuCollapsed: true,
      nbDisplayedPanels: 0,
    };
  },
  computed: {
    displayedPanels() {
      return this.panels.slice(0, this.nbDisplayedPanels);
    },
    hiddenPanels() {
      return this.panels.slice(this.nbDisplayedPanels);
    },
  },
  created() {
    window.onresize = this.updateNbDisplayedPanels;
  },
  mounted() {
    document.addEventListener("click", this.closeMenu);
    this.nbDisplayedPanels = Math.max(
      Math.floor(
        this.$refs.nav.clientHeight / this.$refs.moreListItem.clientHeight
      ) - 1,
      0
    );
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeMenu);
  },
  methods: {
    updateNbDisplayedPanels() {
      this.nbDisplayedPanels = Math.max(
        Math.floor(
          this.$refs.nav.clientHeight / this.$refs.moreListItem.clientHeight
        ) - 1,
        0
      );
    },
    changePanel(newPanel) {
      if (this.sidePanelCollapsed) {
        this.$emit("update:sidePanelCollapsed");
        this.$emit("update:currentPanel", newPanel);
      } else {
        if (newPanel == this.currentPanel) {
          this.$emit("update:sidePanelCollapsed");
        } else {
          this.$emit("update:currentPanel", newPanel);
        }
      }
    },
    showMenu() {
      this.moreMenuCollapsed = !this.moreMenuCollapsed;
    },
    closeMenu(event) {
      if (
        !this.moreMenuCollapsed &&
        !this.$refs.moreButton.contains(event.target)
      ) {
        this.moreMenuCollapsed = true;
      }
    },
  },
};
</script>

<template>
  <nav ref="nav">
    <ul>
      <li
        v-for="panel in displayedPanels"
        :key="panel.id"
        class="navItem"
        :class="{ selected: currentPanel == panel.id && !sidePanelCollapsed }"
      >
        <button class="icon-button" @click="changePanel(panel.id)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            role="img"
          >
            <title>{{ panel.name }}</title>
            <path fill="currentColor" fill-rule="evenodd" :d="panel.icon" />
          </svg>
        </button>
      </li>
      <li
        ref="moreListItem"
        id="moreWrapper"
        class="navItem"
        :class="{ hidden: hiddenPanels.length == 0 }"
      >
        <button ref="moreButton" class="icon-button" @click="showMenu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            role="img"
          >
            <title>More</title>
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M207.858-432Q188-432 174-446.142q-14-14.141-14-34Q160-500 174.142-514q14.141-14 34-14Q228-528 242-513.858q14 14.141 14 34Q256-460 241.858-446q-14.141 14-34 14Zm272 0Q460-432 446-446.142q-14-14.141-14-34Q432-500 446.142-514q14.141-14 34-14Q500-528 514-513.858q14 14.141 14 34Q528-460 513.858-446q-14.141 14-34 14Zm272 0Q732-432 718-446.142q-14-14.141-14-34Q704-500 718.142-514q14.141-14 34-14Q772-528 786-513.858q14 14.141 14 34Q800-460 785.858-446q-14.141 14-34 14Z"
            />
          </svg>
        </button>
        <ul
          id="moreMenu"
          ref="moreMenu"
          class="dropdownMenu"
          v-if="!moreMenuCollapsed"
        >
          <li
            v-for="panel in hiddenPanels"
            :class="{
              selected: currentPanel == panel.id && !sidePanelCollapsed,
            }"
            @click="changePanel(panel.id)"
          >
            <span class="dot"></span>
            <span>{{ panel.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  height: calc(100% - var(--collapseButton-height));
}

.navItem {
  padding: 0.35rem 0rem;
  border-left: 0.12rem solid transparent;
  margin-bottom: 0.5rem;
  text-align: center;
}

.navItem.selected {
  border-left-color: var(--gray-100);
}

.navItem.selected .icon-button {
  color: var(--gray-100);
}

#moreWrapper {
  position: relative;
}

#moreWrapper.hidden {
  visibility: hidden;
}

#moreMenu {
  top: 0;
  left: 100%;
  margin-left: 0.25rem;
  margin-top: 0.25rem;
}

#moreMenu li.selected .dot {
  background-color: var(--gray-100);
}

.dot {
  height: 0.5rem;
  width: 0.5rem;
  background-color: var(--gray-300);
  border-radius: 50%;
  margin: auto 0.75rem auto 0.25rem;
}
</style>
