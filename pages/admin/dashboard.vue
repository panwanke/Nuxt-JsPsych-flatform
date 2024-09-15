<template>
  <div class="dashboard">
    <h1>Admin Dashboard</h1>

    <section>
      <h2>Users Management</h2>
      <!-- <UserTable :users="users" @refresh="fetchUsers" />
      <button @click="createUser">Add New User</button> -->
    </section>

    <section>
      <h2>Items Management</h2>
      <!-- <ItemTable :items="items" @refresh="fetchItems" />
      <button @click="createItem">Add New Item</button> -->
    </section>
  </div>
</template>

<script setup>
// import UserTable from '~/components/UserTable.vue'
// import ItemTable from '~/components/ItemTable.vue'

definePageMeta({
  middleware: 'admin',
  auth: {
    // 不指定 provider，使用默认的用户身份验证提供器
    redirect: {
      login: '/auth/login',
      logout: '/',
      callback: '/user/profile',
      home: '/',
    },
  },
})

const users = ref([])
const items = ref([])

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
