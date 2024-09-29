<template></template>

<script setup>
definePageMeta({
    layout: 'exp-layout',
})

useHead({
  script: [
    { src: 'https://unpkg.com/@jspsych/plugin-categorize-html@2.0.0' },
    { src: 'https://unpkg.com/@panwanke/jspsych-html-keynbutton-response@2.0.1' },
  ],
})

const router = useRouter()

const user = ref((await useFetch('/api/user')).data.value)
if(!user.value){
  user.value = {
    "name": "您"
  }
}

// 根据设备决定是否显示 button
// const isMobile = useIsMobile()
// console.log('isMobile',isMobile)

onMounted(() => {
  //初始化jsPsych
  const jsPsych = initJsPsych({
    use_webaudio: false,
    display_element: "nuxt-jspsych-container",
    on_finish: async()=> {
      jsPsych.data.displayData();
      const exp_data = jsPsych.data.get().json()
      const { data, error } = await useFetch('/api/upload-exp-data', {
          method: 'POST',
          body: {
            file_name: 'test_exp_data',
            exp_data: exp_data
          },
          headers: {
            'Content-Type': 'application/json'
          }
      });
      console.log('uploading status', data.value, error.value)
      // await exp_completed()
      // console.log('Done items',JSON.stringify(items.value, null, 4))
      router.push('/user/myexp')
      // router.back()
    }
  });
  
  // 定义实验变量
  let stim_design = [
    { ismatch: 'mismatch', target: '圆' },
    { ismatch: 'match', target: '圆' },
    { ismatch: 'mismatch', target: '方' },
    { ismatch: 'match', target: '方' },
  ]

  // 实验指导语
  const instructions = {
    type: jsPsychHtmlKeyAndButtonPlugin,
    stimulus: ()=>{
      return `
        <p class="text-center text-red-primary text-[1.2em] pb-2">欢迎${user.value.name}参加知觉匹配任务实验。</p>
        <p>在接下来的任务中，你将看到一排箭头。</p>
        <p>你的任务是忽略两侧的箭头，专注于中间的箭头。</p>
        <p>如果中间箭头指向左，请按“左箭头键”；如果指向右，请按“右箭头键”。</p>
        <p>请尽量又快又准地做出反应。</p>
        <p>请按空格键开始练习。</p>
      `
    },
    choices: [" "],
    button_html: (choice, choice_index)=>{
        return `<button class="jspsych-btn bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 font-bold py-2 md:py-3 lg:py-4 px-4 md:px-8 lg:px-12 rounded focus:outline-none focus:shadow-outline">${choice==" "?"space":"任意按键"}</button>`;
    }
  };

  // 结束语，显示正确率和反应时
  const debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      const trials = jsPsych.data.get().filter({ task: 'test' });
      const correct_trials = trials.filter({ correct: true });
      const accuracy = Math.round((correct_trials.count() / trials.count()) * 100);
      const rt = Math.round(trials.select('rt').mean());

      return `<p>实验结束！</p>
              <p>你的正确率是：${accuracy}%</p>
              <p>你的平均反应时间是：${rt}毫秒</p>
              <p>感谢你的参与！</p>`;
    }
  };

  let matching_trial = {
    type: jsPsychHtmlKeyAndButtonPlugin,
    stimulus: jsPsych.timelineVariable('target'),
    data: {task: 'test'},
    on_finish: function(data) {
      const correct = data.response == 'p';
      data.correct = correct;
    },
    choices: ['p', 'q'],
    trial_duration: 2000
  };

  let matching_loop = {
    timeline: [matching_trial],
    randomize_order: true,
    repetitions: 2,
    timeline_variables: stim_design,
  }

  const timeline = [
    // matching_trial,
    instructions,
    matching_loop,
    debrief_block
  ];

  jsPsych.run(timeline);
})

onUnmounted(() => {
  // jsPsychRef.value.endExperiment()

  reloadNuxtApp({
    force: true,
  })
})
</script>

