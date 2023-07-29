<script>
export default {
  name: "SideNav",
  props: {
    currentPanel: { type: String, required: true },
    panels: { type: Array, required: true },
    sidePanelCollapsed: { type: Boolean, default: true },
    label: { type: String, default: "" },
  },
  emits: ["update:sidePanelCollapsed", "update:currentPanel"],
  data() {
    return {
      nbDisplayedPanels: 0,
      focusedIndex: 0,
      popupShown: false,
      hasFocus: false,
    };
  },
  computed: {
    displayedPanels() {
      return this.panels.filter((_, index) => index < this.nbDisplayedPanels);
    },
    hiddenPanels() {
      return this.panels.filter((_, index) => index >= this.nbDisplayedPanels);
    },
    focusedPanel() {
      return this.panels[this.focusedIndex].id;
    },
    currentPanelIndex() {
      return this.panels.findIndex((panel) => panel.id === this.currentPanel);
    },
  },
  created() {
    window.addEventListener("resize", this.updateNbDisplayedPanels);
  },
  mounted() {
    document.addEventListener("click", this.closePopup);
    this.updateNbDisplayedPanels();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closePopup);
    window.removeEventListener("resize", this.updateNbDisplayedPanels);
  },
  methods: {
    updateNbDisplayedPanels() {
      this.nbDisplayedPanels = Math.max(
        Math.floor(this.$refs.nav.clientHeight / this.$refs.moreListItem.clientHeight) - 1,
        0
      );
    },
    changePanel(newPanel) {
      this.$emit("update:currentPanel", newPanel);
      if (this.sidePanelCollapsed || newPanel == this.currentPanel) {
        this.$emit("update:sidePanelCollapsed");
      }
    },
    switchPopup() {
      this.popupShown = !this.popupShown;
    },
    closePopup(event) {
      if (this.popupShown && !this.$refs.moreButton.contains(event.target)) {
        this.popupShown = false;
      }
    },
    changeFocus(newFocusedIndex) {
      this.focusedIndex = newFocusedIndex;
      this.popupShown = newFocusedIndex >= this.nbDisplayedPanels;
    },
    moveFocusDown() {
      this.changeFocus((this.focusedIndex + 1) % this.panels.length);
    },
    moveFocusUp() {
      this.changeFocus((this.focusedIndex + this.panels.length - 1) % this.panels.length);
    },
    moveFocusToFirst() {
      this.changeFocus(0);
    },
    moveFocusToLast() {
      this.changeFocus(this.panels.length - 1);
    },
    onFocusIn() {
      if (!this.hasFocus) {
        this.hasFocus = true;
        if (this.$refs.nav.matches(":focus-visible")) {
          this.changeFocus(this.currentPanelIndex);
        }
      }
    },
    onFocusOut() {
      if (!this.$refs.nav.matches(":focus-within")) {
        this.hasFocus = false;
        this.popupShown = false;
      }
    },
  },
};
</script>

<template>
  <nav
    ref="nav"
    role="tablist"
    :aria-label="label"
    aria-orientation="vertical"
    tabindex="0"
    @keyup.up="moveFocusUp"
    @keyup.down="moveFocusDown"
    @keyup.home="moveFocusToFirst"
    @keyup.end="moveFocusToLast"
    @keyup.enter="changePanel(focusedPanel)"
    @keyup.space="changePanel(focusedPanel)"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <ul :class="{ 'panels-expanded': !sidePanelCollapsed }">
      <li
        v-for="panel in displayedPanels"
        :key="panel.id"
        class="nav-item"
        :class="{ focused: focusedPanel == panel.id }"
        role="tab"
        :aria-controls="'#' + panel.id"
        :aria-selected="currentPanel == panel.id"
      >
        <button class="icon-button" tabindex="-1" @click="changePanel(panel.id)">
          <svg viewBox="0 -960 960 960" role="img">
            <title>{{ panel.name }}</title>
            <path fill="currentColor" fill-rule="evenodd" :d="panel.icon" />
          </svg>
        </button>
      </li>
      <li ref="moreListItem" class="nav-item more" :class="{ hidden: hiddenPanels.length == 0 }">
        <button ref="moreButton" class="icon-button" tabindex="-1" @click="switchPopup">
          <svg viewBox="0 -960 960 960" role="img">
            <title>More</title>
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M207.858-432Q188-432 174-446.142q-14-14.141-14-34Q160-500 174.142-514q14.141-14 34-14Q228-528 242-513.858q14 14.141 14 34Q256-460 241.858-446q-14.141 14-34 14Zm272 0Q460-432 446-446.142q-14-14.141-14-34Q432-500 446.142-514q14.141-14 34-14Q500-528 514-513.858q14 14.141 14 34Q528-460 513.858-446q-14.141 14-34 14Zm272 0Q732-432 718-446.142q-14-14.141-14-34Q704-500 718.142-514q14.141-14 34-14Q772-528 786-513.858q14 14.141 14 34Q800-460 785.858-446q-14.141 14-34 14Z"
            />
          </svg>
        </button>
        <ul class="popup" v-show="popupShown">
          <li
            v-for="panel in hiddenPanels"
            role="tab"
            :class="{ focused: focusedPanel == panel.id }"
            :aria-controls="'#' + panel.id"
            :aria-selected="currentPanel == panel.id"
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
  height: calc(100% - var(--expand-button-height));
  outline: none;
  border: 2px solid transparent;
  border-radius: 0.1rem;
}

nav:focus-visible {
  border-color: var(--blue-100);
}

.nav-item {
  padding: 0.35rem 0rem;
  border-left: 0.12rem solid transparent;
  margin-bottom: 0.5rem;
  text-align: center;
}

nav:focus-visible .nav-item.focused button {
  color: var(--button-color-focus-visible);
  background-color: var(--button-background-color-focus-visible);
  border-color: var(--button-border-color-focus-visible);
}

.panels-expanded .nav-item[aria-selected="true"] {
  border-left-color: var(--gray-100);
}

.panels-expanded .nav-item[aria-selected="true"] .icon-button {
  color: var(--gray-100);
}

.nav-item.more {
  position: relative;
}

.nav-item.more.hidden {
  visibility: hidden;
}

.popup {
  position: absolute;
  z-index: var(--popup-z-index, 100);
  min-width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  top: 0;
  left: 100%;
  margin-left: 0.25rem;
  margin-top: 0.25rem;
  background-color: var(--popup-background-color, #ffffff);
  border-width: var(--popup-border-width, 2px);
  border-style: var(--popup-border-style, solid);
  border-color: var(--popup-border-color, #000000);
  border-radius: var(--popup-border-radius, 0.25rem);
  padding: var(--popup-padding, 0.25rem);
  white-space: nowrap;
  text-align: start;
}

.popup [role="tab"] {
  display: flex;
  gap: 0.4rem;
  cursor: pointer;
  color: var(--option-color, #333333);
  border-radius: var(--option-border-radius, 0.25rem);
  padding: var(--option-padding, 0.25rem);
  margin-block: var(--option-margin-block, 0.1rem);
}

nav:focus-visible .popup [role="tab"].focused,
.popup [role="tab"]:hover {
  background-color: var(--option-background-color-highlighted, hsl(210, 70%, 60%));
}

.popup [role="tab"][aria-selected="true"] {
  color: var(--option-color-selected, #000000);
}

.popup [role="tab"][aria-selected="true"] .dot {
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
