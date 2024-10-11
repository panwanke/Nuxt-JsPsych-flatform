<!-- modified from shop.vue -->
<script setup>

useHead({
    title: '我的实验',
    meta: [
        { name: 'description', content: '我已经已参与的实验' }
    ],
})

definePageMeta({
    middleware: ['user-auth', 'query-validation']
})

const userExp = useUserExp()
const items = ref(await userExp.getItems())
// console.log('myexp.vue items',items.value)


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
                @sort="async () => { items = await userExp.getItems() }"
            />
        </Banner>
        <div class="mt-4 lg:mt-6">
            <ClientOnly>
                <div 
                    v-if="items?.length" 
                    class="flex flex-col mt-2 gap-2 md:mt-3 md:gap-3"
                >
                    <ListItemCard 
                        v-for="item in items" 
                        :key="item.id" 
                        :item="item.experiment"
                    >
                        <div class="hidden md:flex flex-col justify-center shrink-0 gap-2 mr-5 w-40">
                            <!-- TODO: 如果实验成功完成，可跳转到用户的实验结果 -->
                            <div 
                                v-if="item.isDone"
                            >
                                <Button 
                                    size="small" 
                                    variant="secondary" 
                                    > 
                                    <IconsTrashBin class="!size-5" />
                                    <span> 已完成实验 </span>
                                </Button>
                                <Button 
                                    size="small"
                                > 
                                    <span>查看实验结果</span>
                                    <IconsDoubleChevronRight class="!size-3.5" />
                                </Button>
                            </div>
                            <div v-else>
                                <NuxtLink :to='`/tasks/${item?.experiment.slug}`'>
                                    <Button 
                                        size="small"
                                        variant="secondary" 
                                    > 
                                        <span>现在参加实验</span>
                                        <IconsDoubleChevronRight class="!size-3.5" />
                                    </Button>
                                </NuxtLink>
                                <NuxtLink :to='`/exp/${item?.experiment.slug}`'>
                                    <Button 
                                        size="small" 
                                        > 
                                        <IconsDoubleChevronRight class="!size-5" />
                                        <span> 查看详情 </span>
                                    </Button>
                                </NuxtLink>
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
            </ClientOnly>
        </div>
    </div>
</template>