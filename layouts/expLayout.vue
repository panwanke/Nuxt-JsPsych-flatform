<template>
  <!-- <SearchModal />
  <Header /> -->
  <div id="app-layout">
    <slot />
  </div>
  <Footer />
</template>

<script lang="ts" setup>
useHead({
  // title: '测试实验：Flanker Test',
  // meta: [
  //   { name: 'description', content: '用于测试 jspsych (CDN) 在 nuxt 框架中的可用性' }
  // ],
  // bodyAttrs: {
  //   class: 'test'
  // },
  script: [
    { src: 'https://unpkg.com/jspsych@8.0.0' },
    { src: 'https://unpkg.com/@jspsych/plugin-html-keyboard-response@2.0.0' },
    { src: 'https://unpkg.com/@jspsych/plugin-html-button-response@2.0.0' },
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

<style>

</style>