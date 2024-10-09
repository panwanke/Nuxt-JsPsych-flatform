<template>
  <div class="h-screen flex flex-col bg-gray-dark shadow-lg">
    <div id="nuxt-jspsych-container" class="flex flex-grow bg-white mx-auto w-full px-2 sm:px-4 md:px-7 lg:px-10 max-w-5xl xl:max-w-8xl text-base md:text-xl lg:text-2xl 2xl:text-3xl">
    </div>
    <Footer />
  </div>
</template>

<script setup>

definePageMeta({
  layout: false
})

useHead({
  title: '知觉匹配任务',
  // 添加CDN插件 
  script: [
    { src: "https://unpkg.com/jspsych@8.0.2" },
    { src: "https://unpkg.com/@jspsych/plugin-html-keyboard-response@2.0.0" },
    { src: "https://unpkg.com/@jspsych/plugin-virtual-chinrest@3.0.0" },
  ],
  link: [
    {
      href: 'https://unpkg.com/jspsych@8.0.0/css/jspsych.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ],
})

onMounted(() => {
  const jsPsych = initJsPsych(
    {display_element: "nuxt-jspsych-container",}
  );
  // const trial = {
  //   type: jsPsychHtmlKeyboardResponse,
  //   stimulus: '<p>Hello world!</p>',
  //   choices: "NO_KEYS"
  // }
  const trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <div class="flex flex-row justify-evenly items-center">
      <div class="circle"></div>
      <div class="square"></div>
      <div class="circle"></div>
    <div/>
    `,
    choices: "NO_KEYS"
  }

  jsPsych.run([trial]);
})

</script>

<style>
body {
  /* 隐藏鼠标 */
  /* cursor: none;   */
  /* 隐藏文本光标或插入符 */
  caret-color: transparent;
}


@media (max-width: 640px) {
  p {
    font-size: 1.5rem;
    line-height: 1rem;
  }
}
@media (min-width: 640px) {
  p {
    font-size: 1.8rem;
    line-height: 1.2rem;
  }
}
@media (min-width: 768px) {
  p {
    font-size: 2rem;
    line-height: 1.5rem;
  }
}
@media (min-width: 1024px) {
  p {
    font-size: 2.5rem;
    line-height: 2rem;
  }
}
@media (min-width: 1280px) {
  p {
    font-size: 3rem;
    line-height: 2rem;
  }
}

.circle{
  --tw-bg-opacity: 1;
  --c-wh-400: 4em;
  --c-wh-640: 5.5em;
  --c-wh-768: 5.2em;
  --c-wh-1024: 5em;
  --c-wh-1280: 6em;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity));
  border-radius: 9999px;
}
@media (max-width: 640px) {
  .circle {
    width: var(--c-wh-400);
    height: var(--c-wh-400);
  }
}
@media (min-width: 640px) {
  .circle {
    width: var(--c-wh-640);
    height: var(--c-wh-640);
  }
}
@media (min-width: 768px) {
  .circle {
    width: var(--c-wh-768);
    height: var(--c-wh-768);
  }
}
@media (min-width: 1024px) {
  .circle {
    width: var(--c-wh-1024);
    height: var(--c-wh-1024);
  }
}
@media (min-width: 1280px) {
  .circle {
    width: var(--c-wh-1280);
    height: var(--c-wh-1280);
  }
}

.square{
  --tw-bg-opacity: 1;
  --s-wh-400: 3.7em;
  --s-wh-640: 5.2em;
  --s-wh-768: 4.9em;
  --s-wh-1024: 4.8em;
  --s-wh-1280: 5.8em;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity));
}
@media (max-width: 640px) {
  .square {
    width: var(--s-wh-400);
    height: var(--s-wh-400);
  }
}
@media (min-width: 640px) {
  .square {
    width: var(--s-wh-640);
    height: var(--s-wh-640);
  }
}
@media (min-width: 768px) {
  .square {
    width: var(--s-wh-768);
    height: var(--s-wh-768);
  }
}
@media (min-width: 1024px) {
  .square {
    width: var(--s-wh-1024);
    height: var(--s-wh-1024);
  }
}
@media (min-width: 1280px) {
  .square {
    width: var(--s-wh-1280);
    height: var(--s-wh-1280);
  }
}

</style>