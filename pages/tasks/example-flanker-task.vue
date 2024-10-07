<template></template>

<script setup>

definePageMeta({
    layout: 'exp-layout'
})

useHead({
  script: [
    { src: 'https://unpkg.com/@panwanke/jspsych-html-keynbutton-response@2.0.1' },
  ],
})

const router = useRouter()
const user = ref({
    "id": 1,
    "name": "Test Account",
    "email": "test@psyexp.com",
    "photoUrl": null,
    "registeredOn": "12 September 2024"
})


onMounted(() => {
  //初始化jsPsych
  const jsPsych = initJsPsych({
    use_webaudio: false,
    display_element: "nuxt-jspsych-container",
    on_finish: async()=> {
      jsPsych.data.displayData();
      // await exp_completed()
      // console.log('Done items',JSON.stringify(items.value, null, 4))
      router.push('/user/myexp')
      // router.back()
    }
  });
  
  // 定义实验变量
  const flanker_stimuli = [
    { stimulus: '<<<<<', correct_response: 'arrowleft' },
    { stimulus: '>>>>>', correct_response: 'arrowright' },
    { stimulus: '<<><<', correct_response: 'arrowright' },
    { stimulus: '>><>>', correct_response: 'arrowleft' }
  ];

  // 实验指导语
  const instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: ()=>{
      const introduction = `
        <p class="text-center text-red-primary text-2xl">欢迎${user.value.name}参加Flanker任务实验。</p>
        <p>在接下来的任务中，你将看到一排箭头。</p>
        <p>你的任务是忽略两侧的箭头，专注于中间的箭头。</p>
        <p>如果中间箭头指向左，请按“左箭头键”；如果指向右，请按“右箭头键”。</p>
        <p>请尽量又快又准地做出反应。</p>
        <p>按任意键开始练习。</p>
      `
      return introduction;
    }
      
  };

  // 定义函数
  const compareKeys = (data)=> {
    const response = data.response?data.response:null
    const corret_response = data.correct_response;
    // console.log('corret_response', response, JSON.stringify(data))
    data.correct = jsPsych.pluginAPI.compareKeys(response, corret_response);
  }

  // 练习试次，包含反馈
  const practice_trials = {
    timeline: [
      {
        type: jsPsychHtmlKeyAndButtonPlugin,
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: ['arrowleft', 'arrowright'],
        trial_duration: 1500,
        data: {task: 'practice',correct_response: jsPsych.timelineVariable('correct_response')},
        // 在 on_start 中，data.correct_response 显示为变量名 {name:"correct_response"}。在 on_finish 中，data.correct_response 变为 data 中记录的值。
        // on_start: (data)=>{
        //   console.log('data start',JSON.stringify(data))
        // },
        on_finish: compareKeys
      },
      {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
          const last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
          return last_trial_correct ? '<p>正确！</p>' : '<p>错误！</p>';
        },
        trial_duration: 1000
      }
    ],
    timeline_variables: flanker_stimuli,
    randomize_order: true,
    repetitions: 1
  };

  // 正式实验
  const test_trials = {
    type: jsPsychHtmlKeyAndButtonPlugin,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ['arrowleft', 'arrowright'],
    trial_duration: 1500,
    data: { 
          task: 'test',
          correct_response: jsPsych.timelineVariable('correct_response')
    },
    on_finish: compareKeys
  };

  const test_procedure = {
    timeline: [test_trials],
    timeline_variables: flanker_stimuli,
    randomize_order: true,
    repetitions: 5
  };

  // 结束语，显示正确率和反应时
  const debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      const trials = jsPsych.data.get().filter({ task: 'test' });
      const correct_trials = trials.filter({ correct: true });
      const accuracy = Math.round((correct_trials.count() / trials.count()) * 100);
      const rt = Math.round(correct_trials.select('rt').mean());

      return `<p>实验结束！</p>
              <p>你的正确率是：${accuracy}%</p>
              <p>你的平均反应时间是：${rt}毫秒</p>
              <p>感谢你的参与！</p>`;
    }
  };

  // 创建实验时间线
  const timeline = [
    instructions, 
    practice_trials, 
    test_procedure, 
    debrief_block];

  // 初始化实验
  jsPsych.run(timeline)
})
</script>