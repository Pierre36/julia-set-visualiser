<script>
import TopNav from './components/TopNav.vue';
import SideBar from './components/SideBar.vue';

export default {
  name: 'app',
  components: { TopNav, SideBar }
}
</script>

<template>
 <TopNav/>
	<main>
		<SideBar/>
		<div>
		</div>
	</main>
</template>

<style scoped>
main {
	display: flex;
	flex-grow: 1;
	height: calc(100vh - var(--topNav-height));
}
</style>
