<template>
  <div class="h-screen flex flex-col bg-gray-dark shadow-lg">
    <Header />
    <div id="nuxt-jspsych-container" class="flex flex-grow bg-white mx-auto w-full px-2 sm:px-4 md:px-7 lg:px-10 max-w-5xl xl:max-w-8xl text-base md:text-xl lg:text-2xl 2xl:text-3xl">
      <slot />
    </div>
    <Footer />
  </div>
</template>


