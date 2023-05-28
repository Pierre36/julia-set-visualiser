<script>
import TopNav from './components/TopNav.vue'
import SideBar from './components/SideBar.vue'
import { displayScene } from './graphics'
import vertexShaderSource from './assets/shaders/vertex_shader.vs?raw'
import fragmentShaderSource from './assets/shaders/fragment_shader.fs?raw'

export default {
  name: 'app',
  components: { TopNav, SideBar },
  data() {
    return {
      parameters: {
        'resolutionScale': 1
      }
    }
  },
  mounted() {
    const shaderSources = { 'vertex': vertexShaderSource, 'fragment': fragmentShaderSource };
    try {
      displayScene(this.$refs.glCanvas, shaderSources, this.parameters);
    } catch (e) {
      console.error(e);
    }
  },
}
</script>

<template>
  <TopNav />
  <main>
    <SideBar />
    <div id="content">
      <canvas id="glCanvas" ref="glCanvas"></canvas>
    </div>
  </main>
</template>

<style scoped>
main {
  position: relative;
  display: flex;
  height: calc(100vh - var(--topNav-height));
  min-height: var(--page-min-height);
}

#content {
  flex-grow: 1;
}

#glCanvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
