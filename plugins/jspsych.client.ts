import { initJsPsych, JsPsych } from "jspsych"
import jsPsychHtmlKeyAndButtonPlugin from '@panwanke/jspsych-html-keynbutton-response';
import browserCheck from '@jspsych/plugin-browser-check'
import fullscreen from '@jspsych/plugin-fullscreen'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      // sayHello: (msg: string) => `Hello ${msg}!`,
      initJsPsych: initJsPsych,
      HtmlKeyAndButtonPlugin: jsPsychHtmlKeyAndButtonPlugin,
      browserCheck: browserCheck,
      fullscreen: fullscreen
      // KeyAndButton: jsPsychHtmlKeyAndButtonPlugin
    }
  }
})
