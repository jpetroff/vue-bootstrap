<template>
	<div id="popup">
		<a href="#" @click.prevent="showModal = true">Open</a>
		<popup-modal v-show="showModal" @close="showModal = false">
			<div slot="body" >Text</div>
		</popup-modal>
	</div>
</template>

<script>
w.popup = new Vue({
	template: "<%= template %>",
	data: {
		showModal: true
	},
	components: {
		'popup-modal': Components['popup-modal']
	}
});
</script>