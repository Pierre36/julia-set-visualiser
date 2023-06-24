<script>
import InfoButton from "./InfoButton.vue";

export default {
  name: "InfoHeader",
  components: { InfoButton },
  props: {
    centerTitle: { type: Boolean, default: false },
  },
  data() {
    return {
      expanded: false,
    };
  },
  methods: {
    toggleInfo() {
      this.expanded = !this.expanded;
      if (this.expanded) {
        this.$refs.infoHeaderInfo.setAttribute("data-state", "expanded");
      } else {
        this.$refs.infoHeaderInfo.setAttribute("data-state", "collapsed");
      }
    },
  },
};
</script>

<template>
  <div class="infoHeader">
    <div class="infoHeaderHeader" :class="{ centerTitle: centerTitle }">
      <div class="infoHeaderTitle">
        <slot name="title"></slot>
      </div>
      <InfoButton class="infoButton" :aria-expanded="expanded" @click="toggleInfo" />
    </div>
    <div ref="infoHeaderInfo" class="infoHeaderInfo">
      <div class="infoContainer">
        <slot name="info"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* General */

.infoHeader {
  --animation-duration: 300ms;
}

.infoHeaderHeader {
  display: grid;
  grid-template-columns: auto 2rem;
  align-items: center;
}

.infoHeaderInfo {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--animation-duration) ease-in-out;
}

.infoContainer {
  overflow: hidden;
  padding-inline: 0.5rem;
  border-radius: 0.25rem;
  border-color: var(--gray-100);
  border-style: solid;
  border-width: 0px;
}

.infoHeaderInfo[data-state="collapsed"] .infoContainer {
  animation: collapseInfoContainer var(--animation-duration) ease-in-out forwards;
}

/* Expanded */

:deep() .infoButton[aria-expanded="true"] {
  color: var(--gray-100);
}

.infoHeaderInfo[data-state="expanded"] {
  grid-template-rows: 1fr;
}

.infoHeaderInfo[data-state="expanded"] .infoContainer {
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

/* Center title */

.infoHeaderHeader.centerTitle {
  grid-template-columns: 2rem auto 2rem;
}

.centerTitle .infoHeaderTitle {
  grid-column: 2;
  text-align: center;
}

.centerTitle .infoButton {
  grid-column: 3;
}

.centerTitle .infoContainer {
  grid-column: span 3;
}
</style>
