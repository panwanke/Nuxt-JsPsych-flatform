// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  // googleFonts: {
  //   families: {
  //     Kanit: [200, 300, 400, 500],
  //     Ubuntu: [400, 700]
  //   }
  // },

  auth: {
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'credentials',
      addDefaultCallbackUrl: true
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },

  devtools: {
    enabled: true
  },

  build: {
    transpile: ['vue-toastification'],
  },

  runtimeConfig: {
    public: {
      authOrigin: process.env.AUTH_ORIGIN,
      perPage: 20
    }
  },

  modules: [
    '@sidebase/nuxt-auth',
    'nuxt-headlessui',
    '@vue-email/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    'nuxt-swiper',
    '@nuxtjs/robots'
  ],

  compatibilityDate: '2024-09-08'
})