<script setup>

useHead({
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} - 心理学实验平台` : '心理学实验平台'
	},
	meta: [{ 
        name: 'description', content: '\
        快来参与有趣的心理学实验吧'
    }],
})

useSync()

</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style>

@keyframes slideIn {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0%);
	}
}
@keyframes slideOut {
	from {
		transform: translateY(0%);
		opacity: 100;
	}
	to {
		transform: translateY(150%);
		opacity: 0;
	}
}

.toast-enter-active {
  	animation-name: slideIn;
 	animation-duration: 200ms;
}
.toast-leave-active {
  	animation-name: slideOut;
  	animation-duration: 300ms;
}

</style>
