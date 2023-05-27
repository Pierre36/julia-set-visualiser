<script>
import TopNav from './components/TopNav.vue'
import SideBar from './components/SideBar.vue'

export default {
  name: 'app',
  components: { TopNav, SideBar }
}
</script>

<template>
  <TopNav />
  <main>
    <SideBar />
    <div id="content">
      <canvas id="glcanvas"></canvas>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  height: calc(100vh - var(--topNav-height));
  min-height: var(--page-min-height);
}

#content {
  flex-grow: 1;
}

#glcanvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
