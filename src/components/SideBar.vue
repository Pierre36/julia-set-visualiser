<script>
import SideNav from './SideNav.vue';
import SidePanel from './SidePanel.vue';

export default {
	name: "side-bar",
	components: { SideNav, SidePanel }
}
</script>

<template>
	<div id="sideBar">
		<SideNav/>
		<SidePanel/>
	</div>
</template>

<style scoped>
#sideBar {
	display: flex;
}
</style>
