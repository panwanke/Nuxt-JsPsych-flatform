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
    isEnabled: true,
    disableServerSideAuth: false,
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'credentials',
      addDefaultCallbackUrl: true,
    },
    sessionRefresh: {
      enablePeriodically: true,
      enableOnWindowFocus: true,
    }
  },

  // prisma: {
  //   installStudio: false,
  // },

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
    authSecret: process.env.AUTH_SECRET || 'epool-secret-key', 
    public: {
      perPage: 10
    }
  },

  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/device',
    'nuxt-headlessui',
    '@vue-email/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    // '@prisma/nuxt',
    '@nuxtjs/robots'
  ],

  compatibilityDate: '2024-09-08'
})