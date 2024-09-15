<!-- modified from shop.vue -->
<script setup>

useHead({
    title: '参与的实验',
    meta: [
        { name: 'description', content: '已参与实验' }
    ],
})

definePageMeta({
    middleware: 'query-validation'
})

const loggedIn = useStatus()
const favorites = useFavorites()

const items = ref(await favorites.getItems())
// console.log('fav items',JSON.stringify(items.value, null, 4))
items.value.map((item) => {
    item.expStatus = 'doing'
 })

const removeItem = useDebounceFn(async (id) => {
    await favorites.removeItem(id)
    items.value = await favorites.getItems()
})

</script>

<template>
    <div>
        <Banner
            icon="bookmark"
            title="已参与"
            description=""
        >
            <Sort 
                v-if="items?.length !== 0"
                @sort="async () => { items = await favorites.getItems() }"
            />
        </Banner>
        <div class="mt-4 lg:mt-6">
            <ClientOnly>
                <div 
                    v-if="!loggedIn && items?.length" 
                    class="flex flex-col gap-2 md:gap-3"
                >
                    <AuthPrompt>
                        <p class="mx-8 sm:mx-0">
                            参加实验请进行注册和登陆. 
                        </p>
                    </AuthPrompt>
                    <Separator class="!py-2" />
                </div>
                <div 
                    v-if="items?.length" 
                    class="flex flex-col mt-2 gap-2 md:mt-3 md:gap-3"
                >
                    <ListItemCard 
                        v-for="item in items" 
                        :key="item.id" 
                        :item="item"
                    >
                        <div class="hidden md:flex flex-col justify-center shrink-0 gap-2 mr-5 w-40">
                            <!-- TODO: 如果实验成功完成，可跳转到用户的实验结果 -->
                            <div 
                                v-if="item.expStatus === 'done'"
                            >
                                <Button 
                                    size="small" 
                                    variant="secondary" 
                                    > 
                                    <IconsTrashBin class="!size-5" />
                                    <span> 已完成实验 </span>
                                </Button>
                                <!-- <NuxtLink :to='`/item/${item.id}`'> -->
                                <Button 
                                    size="small"
                                > 
                                    <span>查看实验结果</span>
                                    <IconsDoubleChevronRight class="!size-3.5" />
                                </Button>
                                <!-- </NuxtLink> -->
                            </div>
                            <div v-else>
                                <a href='/example-flanker-test'>
                                    <Button 
                                        size="small"
                                        variant="secondary" 
                                    > 
                                        <span>现在参加实验</span>
                                        <IconsDoubleChevronRight class="!size-3.5" />
                                    </Button>
                                </a>
                                <Button 
                                    @click="removeItem(item.id)"
                                    size="small" 
                                    > 
                                    <IconsTrashBin class="!size-5" />
                                    <span> 已选择(点击退出) </span>
                                </Button>
                            </div>
                        </div>
                        <div class="md:hidden absolute bottom-1 right-1">
                            <Button 
                                @click="removeItem(item.id)" 
                                aria-label="remove"
                                class="!p-[7px]" 
                            > 
                                <IconsTrashBin class="!size-[18px]" />
                            </Button>
                        </div>
                    </ListItemCard>
                </div>
                <EmptyState 
                    v-else-if="!items?.length"
                    title="您还没有参与任何实验"
                    description="
                        <p class='hidden md:block'>
                            请前往发布页面查看您感兴趣的实验，并点击“现在参加实验”按钮参与实验
                        </p>
                    "
                >
                    <NuxtLink to="/new_index" class="max-w-32 sm:max-w-40 w-full">
                        <Button 
                            variant="secondary" 
                            size="small" 
                            class="mt-1"
                        > 
                            <span> 现在参加! </span>
                            <IconsDoubleChevronRight class="!size-4" />
                        </Button>
                    </NuxtLink>
                </EmptyState>
                <template #fallback>
                    <div class="flex w-full items-center justify-center gap-1 py-4 md:py-10">
                        <IconsSpinner class="size-5 text-white animate-spin mr-1" />
                        <h1 class="text-xl text-center text-white">
                            加载中...
                        </h1>
                    </div>
                </template>
            </ClientOnly>
        </div>
    </div>
</template>