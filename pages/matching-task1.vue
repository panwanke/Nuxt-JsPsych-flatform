<template></template>

<script setup>

const { isMobile } = useDevice()
const { $initJsPsych, $HtmlKeyAndButtonPlugin, $fullscreen, $browserCheck } = useNuxtApp()
import "assets/css/countDown.css"
import { DesignGenerator, BrowserCheck,HtmlGenerator } from "~/utils/jsPsychUtiles";

definePageMeta({
  layout: 'exp-layout',
})

useHead({
  title: '知觉匹配任务',
  link: [
    {
      href: 'https://unpkg.com/jspsych@8.0.0/css/jspsych.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ],
})
const router = useRouter()

const user = ref()
// user = await useFetch('/api/user').data.value
if (!user.value) {
  user.value = {
    "name": "您"
  }
}
const userId = 1

// 定义实验设计
const keyBalance = [
  {"key": ['q', 'p'],"label": ['圆', '方']},
  {"key": ['q', 'p'],"label": ['方', '圆']},
  {"key": ['q', 'p'],"label": ['match', 'mismatch']},
  {"key": ['q', 'p'],"label": ['mismatch', 'match']},
]
const designGenerator = new DesignGenerator(userId)
const session_design = designGenerator.generateCombo(
  {
    session_order: [["shape", "matchness"], ["matchness", "shape"]],
    key_balance: [
      [keyBalance[0], keyBalance[2]],
      [keyBalance[0], keyBalance[3]],
      [keyBalance[1], keyBalance[2]],
      [keyBalance[1], keyBalance[3]],
    ]
  }
)
const exp_bw_cond = designGenerator.selectCondition(session_design)
// 注意抽到 shape 时，需要提取第一个 keymap。
// console.log('exp_bw_cond', exp_bw_cond)


// 定义实验变量
const stimHtmlFunc = (input) => {

  const stimOptions = {
    "圆": `<div class="w-[3.5em] h-[3.5em] md:w-[4em] md:h-[4em] bg-black rounded-full"></div>`,
    "方": `<div class="w-[3.1em] h-[3.1em] md:w-[3.8em] md:h-[3.8em] bg-black"></div>`,
  };
  const { ismatch, target } = input
  const targetStim = stimOptions[target];
  const otherOptionKey = target === '圆' ? '方' : '圆';
  const flankerStim = ismatch === 'match' ? targetStim : stimOptions[otherOptionKey];

  const stim_html = `<div class="flex flex-row xxs:w-[200px] xs:w-[230px] sm:w-[250px] md:w-[350px] lg:w-[400px] pb-8 md:pd-20 justify-evenly items-center">${flankerStim}${targetStim}${flankerStim}</div>`;

  return stim_html;
};
const stimGenerator = new DesignGenerator(userId)
let stim_design = stimGenerator.generateCombo({ ismatch: ['mismatch', 'match'], target: ['圆', '方'] })
// console.log('stim_design',stim_design)


const BC = new BrowserCheck(
  [
    {
      rule: "data.fullscreen",
      message: 'You must enalbe fullscreen mode to continue'
    },
    {
      rule: "data.vsync_rate > 60",
      message: 'Your vsync rate is too slow (should be larger than 60) to run this experiment'
    }
  ]
)
const htmlGenerator = new HtmlGenerator()

onMounted(() => {

  //初始化jsPsych
  const jsPsych = $initJsPsych({
    use_webaudio: false,
    display_element: "nuxt-jspsych-container",
    on_finish: async () => {
      jsPsych.data.displayData();
      // const exp_data = jsPsych.data.get().json()
      // const { data, error } = await useFetch('/api/upload-exp-data', {
      //     method: 'POST',
      //     body: {
      //       file_name: 'test_exp_data',
      //       exp_data: exp_data
      //     },
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      // });
      // console.log('uploading status', data.value, error.value)
      // await exp_completed()
      // console.log('Done items',JSON.stringify(items.value, null, 4))
      // router.push('/user/myexp')
      router.push('/matching-task1')
      // router.back()
    }
  });

  // some pre-exp checks
  const enter_fullscreen = {
    type: $fullscreen,
    message: `<div class="mx-auto px-8">实验需要全屏模式，请点击按钮进入全屏模式</div>`,
    button_label: htmlGenerator.generateButton("继续"),
    fullscreen_mode: true
  };
  const exit_fullscreen = {
    type: $fullscreen,
    message: `<div class="mx-auto px-8">退出全屏</div>`,
    fullscreen_mode: false,
    delay_after: 1500
  };
  const browserCheck = {
    type: $browserCheck,
    skip_features: ['webaudio', 'webcam', 'microphone', 'mobile'],
    inclusion_function: (data) => {
      const isContinue = BC.checkRule(data)
      return isContinue;
    },
    exclusion_message: () => {
      const outMessage = BC.printOutMessage()
      setTimeout(() => navigateTo('/'), 2000);
      return outMessage
    }
  };
  // 实验指导语和结束语等
  const instrucGenerator = (keyMap, session)=>{
    return {
      type: $HtmlKeyAndButtonPlugin,
      stimulus: () => {
        let str = `
          <div class="px-2 xxs:px-5 mx-auto">
          <p class="text-center text-red-primary text-[1.2em] pb-2">欢迎您参加知觉${session=="matchness"?"匹配":"判断"}任务实验。</p>
          <p>在接下来的任务中，你将看到一排图形(圆形●或方形■)。</p>`
        if (session=="matchness"){
          str += `<p>你需要专注于中间的图形，判断中间的图形和两侧的图形是否相同或匹配。</p><p>如果图形${keyMap.label[0]=="match"?"匹配":"不匹配"}，请按“${keyMap.key[0]}”；
          如果图形${keyMap.label[1]=="match"?"匹配":"不匹配"}，请按“${keyMap.key[1]}”。</p>
          `
        }else{
          str += `<p>你的任务是忽略两侧的图形，专注于中间的图形。</p>
          <p>如果中间的图形是${keyMap.label[0]}，请按“${keyMap.key[0]}”；
          如果是${keyMap.label[1]}，请按“${keyMap.key[1]}”。</p>`
        }
        str += `<p>请尽量又快又准地做出反应。</p>
        <p>请按空格键开始练习。</p>
        </div>`
        return str
      },
      choices: [" "],
      button_html: htmlGenerator.generateButton
    }
  };
  const formal_test_instruc = {
      type: $HtmlKeyAndButtonPlugin,
      stimulus: () => {
        let str = `
          <div class="px-2 xxs:px-5 mx-auto">
          <p class="text-center text-red-primary text-[1.2em] pb-2">练习结束，现在开始正式实验</p>
          <p>请注意：正式实验中将不再会呈现反馈。</p>
          </div>
          `
        return str
      },
      choices: [" "],
      button_html: htmlGenerator.generateButton
    };
  const end_instruc = {
    type: $HtmlKeyAndButtonPlugin,
    stimulus: () => {
      let str = `
        <div class="px-2 xxs:px-5 mx-auto">
        <p class="text-center text-red-primary text-[1.2em] pb-2">任务结束，期待下次再见。</p></div>
        `
      return str
    },
    choices: [" "],
    button_html: htmlGenerator.generateButton,
    on_finish: () => {
      console.log('all_blocks_results',all_blocks_results)
    }
  };

  /**============================================
   *               生成实验 block
   *=============================================**/
  const all_blocks_results = []
  let block_counter = 0
  const n_all_blocks = 10
  const BlockGenerator = (
    stim_design,
    keyMap,
    judgment_aim = "shape", // "shape" or "matchness"
    task_name = "test",
    nreps_stim = 2,
    nreps_block = 1,
    loop_by_acc = 80, // 正确率需要达到 80% or False
    trial_feedback_conf = {is_show: true, min_rt: 200, max_rt: 1500, duration: 500},
    show_block_feedback = true,
    is_countDown = true,
    ismobile = isMobile,
    fixation_duration = 500,
    stim_duration = 2000,
  ) => {
    
    /**============================================
     *               定义全局闭包变量
     *=============================================**/
    let practice_counter = 0
    const block_results = []

    /**============================================
     *               定义函数
     *=============================================**/
    const get_task_name = (task_name)=>{
      let task_name2 = task_name
      if (practice_counter>0) task_name2 += `_${practice_counter}`
      if (block_counter>0) task_name2 += `_${block_counter}`

      return task_name2
    };
    const get_last_block_res = () => {
      return block_results[block_results.length - 1]
    }
    const html_loop_by_acc = ()=>`<p>您的正确率${get_last_block_res().accuracy}%低于最低标准${loop_by_acc}%！</p><p>请重复进行练习</p>`;
    const html_block_feedback = ()=>{
      let str = ""
      if (n_all_blocks > 1 & task_name.includes("test") ){
        str += `<p>您已完成${block_counter+1}/${n_all_blocks}部分</p>`
        if (block_counter < n_all_blocks - 1) str += "<p>请休息一会儿</p>"
        else str += "<p>恭喜您完成全部任务！</p>"
      } 
      str += `
      <p>你的正确率是：${get_last_block_res().accuracy}%</p>
      <p>你的平均反应时间是：${get_last_block_res().rt}毫秒</p>`

      return str
    };

    /**============================================
     *               定义试次
     *=============================================**/
    const count_down = {
      type: $HtmlKeyAndButtonPlugin,
      stimulus: `<count-down title=""></count-down>`,
      trial_duration: 3650,
      data: {trail_tag: 'countDown_trial'},
      choices: "NO_KEYS"
    }
    // NOTE: 需要根据刺激的高度调整 pd
    const trial_fixation = {
      type: $HtmlKeyAndButtonPlugin,
      stimulus: () => ismobile ? `<div class="pb-[5.5rem] md:pb-[6rem] text-[3em]">+</div>` : `<div class="pb-[2rem] md:pb-[3rem] text-[3em]">+</div>`,
      data: {trail_tag: 'fixation'},
      choices: "NO_KEYS",
      trial_duration: fixation_duration
    };
    const trial_matching = {
      type: $HtmlKeyAndButtonPlugin,
      stimulus:  () => {
        const target = jsPsych.evaluateTimelineVariable('target');
        const ismatch = jsPsych.evaluateTimelineVariable('ismatch');
        
        return stimHtmlFunc({target, ismatch});
      },
      data: { task: task_name },
      on_finish: function (data) {
        const target = jsPsych.evaluateTimelineVariable('target');
        const ismatch = jsPsych.evaluateTimelineVariable('ismatch');
        data.ismatch = ismatch;
        data.target = target;
        
        if (judgment_aim == "shape") {
          data.correct_key = designGenerator.findKeyByLabel(target, keyMap);
        } else if (judgment_aim == "matchness") {
          data.correct_key = designGenerator.findKeyByLabel(ismatch, keyMap);
        }

        const correct = data.response == data.correct_key;
        data.correct = correct;
        data.response = designGenerator.findLabelByKey(data.response, keyMap);

        data.task = get_task_name(task_name)
      },
      choices: ['q', 'p'],
      show_button: ismobile,
      // show_button: true,
      button_html: (choice, choice_index) => htmlGenerator.generateButton(choice, choice_index, keyMap),
      trial_duration: stim_duration
    };
    const trial_feedback = {
      type: $HtmlKeyAndButtonPlugin,
      data: { trail_tag: "trial_feedback" },
      stimulus: function () {

        const last_data = jsPsych.data.get().last(1).values()[0]
        // console.log('last_data', last_data)
        let time = last_data.rt;
        if (time > trial_feedback_conf.max_rt || time === null) { //大于1500或为null为过慢
          return `<span class='text-yellow-500 text-4xl md:text-5xl lg:text-6xl'>太慢!</span>`
        } else if (time < trial_feedback_conf.min_rt) { //小于两百为过快反应
          return `<span class='text-yellow-500 text-4xl md:text-5xl lg:text-6xl'>过快!</span>`
        } else {
          if (last_data.correct == 1) { //如果按键 == 正确按键
            return `<span class='text-green-400 text-4xl md:text-5xl lg:text-6xl'>正确!</span>`
          } else {
            return `<span class='text-red-500 text-4xl md:text-5xl lg:text-6xl'>错误!</span>`
          }
        }
      },
      choices: "NO_KEYS",
      trial_duration: trial_feedback_conf.duration
    };
    const block_feeback = {
      type: $HtmlKeyAndButtonPlugin,
      data: { trail_tag: "block_feedback" },
      choices: [" "],
      stimulus: html_block_feedback,
      button_html: htmlGenerator.generateButton,
      on_finish: ()=>{
        if (task_name.includes("test")) block_counter++
      }
    };

    /**============================================
     *               定义 timeline
     *=============================================**/
    // 主要试次呈现部分
    let trials_list = [trial_fixation, trial_matching]
    if (trial_feedback_conf.is_show) trials_list.push(trial_feedback)
    let test_timeline = {
      timeline: trials_list,
      randomize_order: true,
      repetitions: nreps_stim,
      timeline_variables: stim_design,
      on_timeline_finish: function () {
        
        const task_name2 = get_task_name(task_name)
        const trials = jsPsych.data.get().filter({ task: task_name2 });
        const correct_trials = trials.filter({ correct: true });
        const accuracy = Math.round((correct_trials.count() / trials.count()) * 100);
        const rt = Math.round(trials.select('rt').mean());

        block_results.push({ task: task_name2,accuracy:accuracy, rt:rt })
        console.log('each block', task_name2, block_results, practice_counter, block_counter)
      }
    };
    // 添加其他组件生成 block
    let block_list = []
    if (is_countDown) block_list.push(count_down)
    block_list.push(test_timeline)
    // 根据正确率决定是否进入下一个 block
    if (loop_by_acc){
      const conditional_feedback_node = {
        timeline: [
          {
            type: $HtmlKeyAndButtonPlugin,
            data: { trail_tag: "loop_feedback" },
            stimulus: html_loop_by_acc,
            choices: [" "],
            button_html: htmlGenerator.generateButton
          }
        ],
        conditional_function: () => get_last_block_res().accuracy < loop_by_acc
      }
      block_list.push(conditional_feedback_node)
      const loop_node = {
        timeline: block_list,
        loop_function: () => {
          const acc = get_last_block_res().accuracy
          const isLoop = acc < loop_by_acc
          if (isLoop) practice_counter++
          return isLoop
        }
      }
      block_list = [loop_node]
    };
    if (show_block_feedback) block_list.push(block_feeback)

    return {
      timeline: block_list,
      repetitions: nreps_block,
      on_timeline_finish: ()=>{
        
        all_blocks_results.push({[task_name]:block_results})
        console.log('end of block', all_blocks_results, block_counter, practice_counter)
      }
    }
  };
  
  /**============================================
   *               生成 timeline
   *=============================================**/
  const timeline = []
  timeline.push(
    browserCheck,
    enter_fullscreen,
  );
  exp_bw_cond.session_order.forEach((session, index) => {
    const keyMap = exp_bw_cond.key_balance[session=="shape"?0:1]
    timeline.push(...[
      instrucGenerator(keyMap, session),
      // practice
      BlockGenerator(
        stim_design, 
        keyMap, 
        session,                  // judgment_aim
        `${session}_practice`,    // task_name
        1,                        // nreps_stim = 5,
      ),
      // test
      formal_test_instruc,
      BlockGenerator(
        stim_design, 
        keyMap, 
        session,             // judgment_aim
        `${session}_test`,   // NOTE: task_name: must include "test" for block counter down
        1,                   // nreps_stim = 10,
        5,                   // nreps_block = 5
        false,               // loop_by_acc = False
        {is_show:false},     // trial_feedback_conf
      )
    ])
  });
  timeline.push(
    end_instruc,
    exit_fullscreen
  )

  jsPsych.run(timeline);
})

// onUnmounted(() => {
//   // jsPsychRef.value.endExperiment()

//   reloadNuxtApp({
//     force: true,
//   })
// })
</script>
