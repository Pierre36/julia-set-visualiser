<script>
export default {
  name: "InfoHeader",
  props: {
    headingCentered: { type: Boolean, default: false },
    headingLevel: { type: Number, default: 2 },
    headingText: { type: String, default: "" },
  },
  data() {
    return {
      expanded: false,
    };
  },
  computed: {
    heading() {
      return `h${this.headingLevel}`;
    },
  },
  methods: {
    toggleInfo() {
      this.expanded = !this.expanded;
      if (this.expanded) {
        this.$refs.infoPanel.setAttribute("data-state", "expanded");
      } else {
        this.$refs.infoPanel.setAttribute("data-state", "collapsed");
      }
    },
  },
};
</script>

<template>
  <div class="info-header">
    <div class="header">
      <component :is="heading" class="title" :class="{ centered: headingCentered }">
        {{ headingText }}
      </component>
      <div class="button-container">
        <button class="icon-button" @click="toggleInfo" :aria-expanded="expanded">
          <svg viewBox="0 -960 960 960" role="img">
            <title>Info</title>
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M483.175-280q12.825 0 21.325-8.625T513-310v-180q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T453-490v180q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625Zm-3.193-314q14.018 0 23.518-9.2T513-626q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447-626q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div ref="infoPanel" class="info-panel">
      <div class="info-container">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-header {
  --animation-duration: 300ms;
  --button-container-width: 2rem;
}

.header {
  display: flex;
  align-items: center;
}

.title {
  flex-grow: 1;
}

.title.centered {
  flex-grow: 1;
  text-align: center;
  margin-left: var(--button-container-width);
}

.button-container {
  text-align: center;
  width: var(--button-container-width);
}

.icon-button {
  padding: 0.1rem;
}

.icon-button svg {
  width: 1.7rem;
  height: 1.7rem;
}

.info-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--animation-duration) ease-in-out;
}

.info-container {
  overflow: hidden;
  padding-inline: 0.5rem;
  border-radius: 0.25rem;
  border-color: var(--gray-100);
  border-style: solid;
  border-width: 0px;
}

.info-panel[data-state="collapsed"] .info-container {
  animation: collapseInfoContainer var(--animation-duration) ease-in-out forwards;
}

.info-button[aria-expanded="true"] {
  color: var(--gray-100);
}

.info-panel[data-state="expanded"] {
  grid-template-rows: 1fr;
}

.info-panel[data-state="expanded"] .info-container {
  animation: expandInfoContainer var(--animation-duration) ease-in-out forwards;
}

@keyframes expandInfoContainer {
  0% {
    opacity: 0;
    margin-top: 0rem;
    padding-block: 0rem;
    border-width: 0px;
  }
  10% {
    opacity: 0;
    border-right-width: 2px;
    border-left-width: 2px;
  }
  100% {
    opacity: 1;
    margin-top: 0.5rem;
    padding-block: 0.5rem;
    border-width: 2px;
  }
}

@keyframes collapseInfoContainer {
  0% {
    opacity: 1;
    margin-top: 0.5rem;
    padding-block: 0.5rem;
    border-width: 2px;
  }
  90% {
    opacity: 0;
    border-right-width: 2px;
    border-left-width: 2px;
  }
  100% {
    opacity: 0;
    margin-top: 0rem;
    padding-block: 0rem;
    border-width: 0px;
  }
}
</style>
