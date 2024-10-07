export class DesignGenerator {
  
  keyMap:{ key: any[]; label: any[]; };
  id:number;

  constructor(id:number, keyMap:{ key: any[]; label: any[]; }) {
    this.id = id;
    this.keyMap = keyMap;
   }

   generateCombo(obj: { [key: string]: any[] }) {
    const keys = Object.keys(obj);
    const result: any[] = [];
  
    function generate(currentIndex: number, currentCombination: {}) {
      if (currentIndex === keys.length) {
        result.push({ ...currentCombination });
        return;
      }
  
      for (const value of obj[keys[currentIndex]]) {
        generate(currentIndex + 1, { ...currentCombination, [keys[currentIndex]]: value });
      }
    }
  
    generate(0, {});
    return result;
  }
  
  selectCondition(conditionList:Array<any>, id = this.id) {
    if (id === undefined) {
      throw new Error('ID is required unless provided via the constructor or class property.');
    }
    const remainder = id % conditionList.length;
    return conditionList[remainder];
  }

  findLabelByKey(key:string, keyMap = this.keyMap) {
    return findLabelByKey(key, keyMap)
  }
  findKeyByLabel(label:string, keyMap = this.keyMap) {
    return findKeyByLabel(label, keyMap);
  }
}

function findLabelByKey(key:string, keyMap:{ key: any[]; label: any[]; }) {
  const index = keyMap.key.indexOf(key);
  if (index !== -1) {
    return keyMap.label[index];
  }
  return null;
}
function findKeyByLabel(label:string, keyMap:{ key: any[]; label: any[]; }) {
  const index = keyMap.label.indexOf(label);
  if (index !== -1) {
    return keyMap.key[index];
  }
  return null;
}

export class HtmlGenerator {

  constructor() {}
  
  generateButton(choice: string, choice_index: number, keyMap={ key:[],label:[]}) {
  
    // this 是 jsPsych Trial 对象，而不是这里的 keyBalance 对象
    // console.log('this.keyMap', choice, keyMap, this)
  
    let str
    if (choice == " ") str = "请按空格继续"
    else if (choice == "ALL_KEY") str = "请按任意键"
    else if (choice == "继续" || choice.toLowerCase() == "continue") return "继续"
    else if (keyMap.key.length > 0) str = `${findLabelByKey(choice, keyMap)}按${choice}`
    else str = `请按${choice}`
  
    return `<button class="jspsych-btn bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 font-bold py-2 md:py-3 lg:py-4 px-4 md:px-8 lg:px-12 rounded focus:outline-none focus:shadow-outline">${str}</button>`;
  }

  generate_block(stim_design: any[], html_callback: (arg0: any) => any) {
    const results = stim_design.map(item => {
      const newItem = { ...item };
      // 启用 html 回调函数
      newItem["html"] = html_callback(newItem);
      return newItem;
    });
    return results;
  };
}

export class BrowserCheck {
  rule: { rule: string; message: string; }[];
  isContinue: boolean;
  outMessage: string;
  DeviceInfo: {};
  
  constructor(rule: { rule: string; message: string; }[]) {
    this.rule = rule
    this.isContinue = true
    this.outMessage = ""
    this.DeviceInfo = {}
  }

  checkRule(data: {}) {

    this.isContinue = true; // 重置 isContinue

    const checkSingleRule = (element: { rule: any; message?: string; }) => {
      // 假设 eval(element.rule) 可能是异步的，或者你可能需要在未来添加异步操作
      try {
        const result = eval(element.rule);
        if (result && result.then) {
          // 如果 eval 的结果是 Promise，则等待它完成
          return result;
        } else {
          // 否则，直接返回结果
          return result;
        }
      } catch (error) {
        // 处理 eval 抛出的任何错误
        console.error('Error evaluating rule:', error);
        return false; // 或者你可以根据需要处理错误
      }
    }

    // 检查 this.rule 是 list 还是 对象
    if (Array.isArray(this.rule)) {
      for (const element of this.rule) {
        // 使用 async/await 来处理可能的异步操作
        if (!(checkSingleRule(element))) {
          this.isContinue = false;
          this.outMessage = element.message;
          break; // 如果规则不满足，则停止检查后续规则
        }
      }
    }
    // else if (typeof this.rule === 'object') {
    //   // ... 这里可以添加对对象的处理逻辑，如果需要的话
    // }

    this.DeviceInfo = data;
    return this.isContinue;
  }

  printOutMessage() {
    console.log('this.outMessage', this.outMessage)
    return this.outMessage
  }
}
