<template>
  <div class="h-screen flex flex-col bg-gray-dark shadow-lg">
    <Header />
    <div id="nuxt-jspsych-container" class="flex flex-grow bg-white mx-auto w-full px-2 sm:px-4 md:px-7 lg:px-10 max-w-5xl xl:max-w-8xl text-base md:text-xl lg:text-2xl 2xl:text-3xl">
      <slot />
    </div>
    <Footer />
  </div>
</template>


<script lang="ts" setup>
useHead({
  script: [
    { src: 'https://unpkg.com/jspsych@8.0.0' },
    { src: 'https://unpkg.com/@jspsych/plugin-html-keyboard-response@2.0.0' },
    { src: 'https://unpkg.com/@jspsych/plugin-preload@2.0.0' },
  ],
  link: [
    {
      href: 'https://unpkg.com/jspsych@8.0.0/css/jspsych.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ],
})
</script>
