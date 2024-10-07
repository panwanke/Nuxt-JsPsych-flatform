<template>
  <!-- 标题 -->
  <div class="flex items-center justify-between">
    <h1 class="text-white text-3xl font-bold text-center my-[14px]">实验信息表</h1>
    <!-- 添加用户按钮 -->
    <div class="flex justify-end">
      <button @click="showModal('add')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        添加实验
      </button>
    </div>
  </div>
  <!-- 表格 -->
  <div class="overflow-y-auto !max-h-[655px]">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="py-3 px-6">名称</th>
          <th scope="col" class="py-3 px-6">描述</th>
          <th scope="col" class="py-3 px-6">价格</th>
          <th scope="col" class="text-center py-3 px-6">操作</th>
        </tr>
      </thead>
      <tbody class="overflow-y-auto !max-h-[500px]">
        <tr v-for="item in paginatedItems" :key="item.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td class="py-4 px-6">{{ item.name }}</td>
          <td class="py-4 px-6">{{ item.description }}</td>
          <td class="py-4 px-6">{{ item.remuneration }}</td>
          <td class="py-2 px-6">
              <div class="flex flex-col justify-center items-center gap-2 !w-14">
                <button @click="showModal('edit', item)" class="bg-green-500 hover:bg-green-700 text-white font-bold w-full py-[2px] px-2 rounded">
                  编辑
                </button>
                <button @click="deleteItem(item.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold w-full py-[2px] px-2 rounded">
                  删除
                </button>
              </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- 分页控制 -->
  <div class="flex justify-center mt-1 space-x-1">
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 rounded disabled:opacity-50"
    >
      上一页
    </button>
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 rounded disabled:opacity-50"
    >
      下一页
    </button>
  </div>
  <!-- 模态框 -->
  <div v-if="modalVisible" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">{{ modalType === 'add' ? '添加用户' : '编辑用户' }}</h2>
        <button class="text-gray-800 hover:text-gray-600" @click="closeModal">&times;</button>
      </div>
      <form @submit.prevent="submitItem" class="mt-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            名称
          </label>
          <input v-model="selectedItem.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="名称">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            邮件
          </label>
          <textarea v-model="selectedItem.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" placeholder="邮件" rows="3"></textarea>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="role">
            身份
          </label>
          <input v-model="selectedItem.role" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="role" type="number" placeholder="身份">
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            {{ modalType === 'add' ? '添加' : '保存' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// 获取项目信息
const {data} = await useFetch('/api/exp',{
  query: {
        sortBy: 'rating',
        direction: 'desc'
  }
})
// console.log('data',data.value)

const items = ref([])
items.value = data.value.items

// 分页状态
const currentPage = ref(1);
const itemsPerPage = ref(10);

// 计算总页数
const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage.value));

// 计算当前页显示的数据
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return items.value.slice(start, end);
});

// 翻页功能
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const deleteItem = (id) => {
  items.value = items.value.filter(item => item.id !== id);
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;  // 如果删除后当前页超出了总页数，调整当前页
  }
};

// 模态框相关
const modalVisible = ref(false)
const modalType = ref('add')
const selectedItem = ref({})

const showModal = (type, item = {}) => {
  modalType.value = type
  selectedItem.value = { ...item }
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
  selectedItem.value = {}
}

// 提交项目（添加或编辑）
const submitItem = async () => {
  if (modalType.value === 'add') {
    // const { data } = await axios.post('/api/projects', selectedItem.value)
    // items.value.push(data)
    console.log("test")
  } else {
    // await axios.put(`/api/projects/${selectedItem.value.id}`, selectedItem.value)
    // const index = items.value.findIndex(item => item.id === selectedItem.value.id)
    // items.value.splice(index, 1, selectedItem.value)
    console.log("test")
  }
  closeModal()
}
</script>

<style>

</style>