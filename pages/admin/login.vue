<script setup>

useHead({
    title: 'ADMIN Login'
})

definePageMeta({
    layout: 'auth',
    middleware: 'auth',
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/',
    },
})

const email = ref('')
const password = ref('')
const role = ref('admin')
const errorMessage = ref('')
const route = useRoute()
const loading = ref(false)

// 使用管理员身份验证提供器
const { signIn } = useAuth()

async function adminLogin() {
    loading.value = true
    errorMessage.value = null
    const { error } = await signIn('credentials', {
        email: email.value,
        password: password.value,
        role: role.value,
        redirect: false
    })
    errorMessage.value = error
    if (!error) {
        localStorage.setItem('syncNeeded', 'true')
        await navigateTo("/admin/dashboard", { 
            external: true
        })
    }
    loading.value = false
}

</script>

<template>
    <AuthCard title="Hi! MY ADMIN!">
        <form @submit.prevent="adminLogin()">
            <div class="flex flex-col gap-4">
                <div>
                    <Label for="email"> Email </Label>
                    <TextInput 
                        v-model="email" 
                        name="email" 
                        id="email" 
                        type="email" 
                        autocomplete="email"
                    >
                        <IconsMail class="text-white" />
                    </TextInput>
                </div>
                <div>
                    <Label for="password"> Password </Label>
                    <TextInput 
                        v-model="password" 
                        name="password" 
                        id="password" 
                        type="password"
                    >
                        <IconsKey class="text-white" />
                    </TextInput>
                </div>
                <Error> {{ errorMessage }} </Error>
                <Button 
                    type="submit" 
                    :variant="loading ? 'loading' : 'primary'"
                >
                    LOG IN
                </Button>
            </div>
        </form>
    </AuthCard>
</template>
