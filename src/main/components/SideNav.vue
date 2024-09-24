<script setup lang="ts">
import PanelId from "@/components/PanelId";
import type { Panel } from "@/components/SideBar.vue";
import { computed, onMounted, onUnmounted, ref, useTemplateRef, type ComputedRef } from "vue";

export interface Props {
  panels: Panel[];
  label?: string;
}

const { panels, label = "" } = defineProps<Props>();

const currentPanel = defineModel<PanelId>("currentPanel", { required: true });
const sidePanelCollapsed = defineModel<boolean>("sidePanelCollapsed", { default: true });

const displayedPanelsCount = ref(0);
const focusedIndex = ref(0);
const popupShown = ref(false);
const hasFocus = ref(false);

const tablist = useTemplateRef<HTMLElement>("tablist");
const moreListItem = useTemplateRef<HTMLElement>("moreListItem");
const moreButton = useTemplateRef<HTMLElement>("moreButton");

const displayedPanels: ComputedRef<Panel[]> = computed(() =>
  panels.filter((_, index) => index < displayedPanelsCount.value)
);

const hiddenPanels: ComputedRef<Panel[]> = computed(() =>
  panels.filter((_, index) => index >= displayedPanelsCount.value)
);

const focusedPanel: ComputedRef<PanelId> = computed(() => panels[focusedIndex.value].id);

const currentPanelIndex: ComputedRef<number> = computed(() =>
  panels.findIndex((panel) => panel.id === currentPanel.value)
);

onMounted(() => {
  window.addEventListener("resize", updateDisplayedPanelsCount);
  document.addEventListener("click", closePopup);
  updateDisplayedPanelsCount();
});

onUnmounted(() => {
  document.removeEventListener("click", closePopup);
  window.removeEventListener("resize", updateDisplayedPanelsCount);
});

function updateDisplayedPanelsCount() {
  displayedPanelsCount.value = Math.max(
    Math.floor(tablist.value!.clientHeight / moreListItem.value!.clientHeight) - 1,
    0
  );
}

function changePanel(newPanel: PanelId) {
  if (sidePanelCollapsed.value || newPanel == currentPanel.value) {
    sidePanelCollapsed.value = !sidePanelCollapsed.value;
  }
  currentPanel.value = newPanel;
}

function switchPopup() {
  popupShown.value = !popupShown.value;
}

function closePopup(event: any) {
  if (popupShown.value && !moreButton.value!.contains(event.target)) {
    popupShown.value = false;
  }
}

function changeFocus(newFocusedIndex: number) {
  focusedIndex.value = newFocusedIndex;
  popupShown.value = newFocusedIndex >= displayedPanelsCount.value;
}

function moveFocusDown() {
  changeFocus((focusedIndex.value + 1) % panels.length);
}

function moveFocusUp() {
  changeFocus((focusedIndex.value + panels.length - 1) % panels.length);
}

function moveFocusToFirst() {
  changeFocus(0);
}

function moveFocusToLast() {
  changeFocus(panels.length - 1);
}

function onFocusIn() {
  if (!hasFocus.value) {
    hasFocus.value = true;
    if (tablist.value!.matches(":focus-visible")) {
      changeFocus(currentPanelIndex.value);
    }
  }
}

function onFocusOut() {
  if (!tablist.value?.matches(":focus-within")) {
    hasFocus.value = false;
    popupShown.value = false;
  }
}
</script>

<template>
  <nav>
    <ul
      ref="tablist"
      :class="{ 'panels-expanded': !sidePanelCollapsed }"
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
      <li
        v-for="panel in displayedPanels"
        :key="panel.id"
        class="nav-item"
        :class="{ focused: focusedPanel == panel.id }"
        role="tab"
        aria-controls="side-panel"
        :aria-selected="currentPanel == panel.id"
      >
        <button class="icon-button" tabindex="-1" @click="changePanel(panel.id)">
          <svg viewBox="0 -960 960 960" role="img">
            <title>{{ panel.name }}</title>
            <path fill="currentColor" fill-rule="evenodd" :d="panel.icon" />
          </svg>
        </button>
      </li>
      <li
        ref="moreListItem"
        class="nav-item more"
        :class="{ hidden: hiddenPanels.length == 0 }"
        aria-hidden="true"
      >
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
            :key="panel.id"
            :class="{ focused: focusedPanel == panel.id }"
            aria-controls="side-panel"
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
}

[role="tablist"] {
  height: 100%;
  outline: none;
  border: 2px solid transparent;
  border-radius: 0.1rem;
}

[role="tablist"]:focus-visible {
  border-color: var(--blue-100);
}

.nav-item {
  padding: 0.35rem 0rem;
  border-left: 0.12rem solid transparent;
  margin-bottom: 0.5rem;
  text-align: center;
}

[role="tablist"]:focus-visible .nav-item.focused button {
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

[role="tablist"]:focus-visible .popup [role="tab"].focused,
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
