<template>
  <div class="flex h-screen">
    <!-- 左侧导航栏 -->
    <nav class="w-1/4 mt-20 mb-[45px] bg-gray-800 text-white p-4">
      <ul>
        <li 
          class="py-2 px-4 hover:bg-gray-700 cursor-pointer"
          :class="{ 'bg-gray-700': currentTab === 'experiment' }"
          @click="currentTab = 'experiment'"
        >
          实验信息表
        </li>
        <li 
          class="py-2 px-4 hover:bg-gray-700 cursor-pointer"
          :class="{ 'bg-gray-700': currentTab === 'user' }"
          @click="currentTab = 'user'"
        >
          用户信息表
        </li>
      </ul>
    </nav>

    <!-- 右侧内容区域 -->
    <div class="flex-1 p-4">
      <section v-if="currentTab === 'experiment'">
        <ExpTableManager />
      </section>
      <section v-if="currentTab === 'user'">
        <UserTableManager />
      </section>
    </div>
    <!-- <div class="flex-1 p-4">
      <UserTableManager />
    </div> -->
  </div>
</template>

<script setup>

definePageMeta({
    layout: 'dashboard',
    middleware: 'admin-auth'
})

// 懒加载组件
const UserTableManager = defineAsyncComponent(() => import('@/components/UserTableManager.vue'));
const ExpTableManager = defineAsyncComponent(() => import('@/components/ExpTableManager.vue'));

// 当前选中的标签，默认是 'experiment'
const currentTab = ref('experiment');

// definePageMeta({
//   middleware: 'admin-auth'
// })

const users = ref([])
// const fetchUsers = async () => {
//   const { data } = await useFetch('/api/user') // 根据你现有的 API 路径
//   users.value = data.value || []
// }

// const fetchItems = async () => {
//   const { data } = await useFetch('/api/item') // 根据你现有的 API 路径
//   items.value = data.value || []
// }

// const createUser = async () => {
//   // 跳转或弹出用户创建表单
// async function createUser(data: any) {
//     await prisma.user.create({
//         data: {
//             name: data.name,
//             photoUrl: data.image,
//             email: data.email,
//             password: bcrypt.hashSync(crypto.randomBytes(32).toString('hex'), 10),
//             favorites: {
//                 create: {
//                     items: {
//                         create: []
//                     }
//                 }
//             },
//             cart: {
//                 create: {
//                     entries: {
//                         create: []
//                     }
//                 }
//             }
//         }
//     })
// }
// }

// const createItem = async () => {
//   // 跳转或弹出 item 创建表单
// }

// onMounted(() => {
//   fetchUsers()
//   fetchItems()
// })
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

h1, h2 {
  margin-bottom: 20px;
}
</style>