<script setup lang="ts">
import { ref, type Ref } from "vue";
import MainHeader from "@/components/layout/MainHeader.vue";
import SideBar from "@/components/layout/SideBar.vue";
import AnimationFrame from "@/components/animation/AnimationFrame.vue";
import Configuration from "@/models/Configuration";

const configuration = ref(Configuration.defaultConfiguration()) as Ref<Configuration>;

function updateConfiguration(newConfiguration: Configuration) {
  configuration.value = newConfiguration;
}
</script>

<template>
  <MainHeader :configuration="configuration" @update:configuration="updateConfiguration" />
  <main>
    <SideBar :configuration="configuration" />
    <AnimationFrame :configuration="configuration" />
  </main>
</template>

<style scoped>
main {
  position: relative;
  display: flex;
  height: calc(100vh - var(--header-height));
  min-height: var(--page-min-height);
  min-width: var(--page-min-width);
}
</style>
