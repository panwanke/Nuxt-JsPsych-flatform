<script setup>

useHead({
    title: 'home',
    meta: [
        { name: 'description', content: 'home' }
    ],
})

definePageMeta({
    middleware: 'query-validation'
})

const route = useRoute()
const router = useRouter()

const page = ref(1)
const loading = ref(false)

const display = computed(() => route.query?.display ?? 'list')


const { data } = await useFetch('/api/exp', {
    query: {
        page: page.value,
        ...useQuery()
    }
})

async function refresh() {
    page.value = 1
    const { data } = await useFetch('/api/exp', {
        query: {
            page: page.value,
            ...useQuery()
        }
    })
    items.value = data.value.items
    count.value = data.value.count
    window.scrollTo(0, 0)
}

const searchBus = useEventBus('search')
searchBus.on(refresh)

const items = ref(data.value.items)
const count = ref(data.value.count)

async function goBack() {
    router.back()
    setTimeout(async () => await refresh(), 50)
    window.scrollTo(0, 0)
}

const { y } = useWindowScroll()

watchDebounced(y, async (newValue) => {
    if (
        Math.round(newValue) + window.innerHeight + 60 >= document.body.scrollHeight && 
        items.value.length < count.value
    ) {
        page.value += 1
        loading.value = true
        let { data: newData } = await useFetch('/api/exp', {
            query: {
                page: page.value,
                ...useQuery()
            }
        })
        items.value.push(...newData.value.items)
        loading.value = false
    }
}, { debounce: 50, maxWait: 500 })

watch(() => useQuery(), async () => {
    setTimeout(async () => await refresh(), 50)
})

</script>

<template>
    <div>
        <!-- 排序和显示方式header -->
        <Banner
            icon="shopping-bag"
            title="已发布实验"
            :description="route.query.search ? `在${route.query.search}检索下，已经有 ${count} ${count === 1 ? 'result' : 'results'} 个实验发布` : `已经发布 ${count} 项实验`"
        >
            <!-- 显示排序和切换list grid模型 -->
            <div class="flex flex-wrap gap-2 md:gap-4 justify-center items-center text-white">
                <div v-if="items.length" class="flex flex-wrap-reverse justify-center gap-2 md:gap-4">
                    <!-- <Sort @sort="refresh" /> -->
                    <Display />
                </div>
            </div>
        </Banner>
        <div class="mt-4 lg:mt-6">
            <!-- 无 items 时界面 -->
            <EmptyState 
                v-if="!items.length"
                title="No results found"
                description="There are no items that match your search options."
            >
                <Button
                    @click="goBack"
                    variant="secondary" 
                    size="small" 
                    class="mt-1 max-w-32 sm:max-w-40 w-full"
                > 
                    <span> GO BACK </span>
                    <IconsDoubleChevronRight class="!size-4" />
                </Button>
            </EmptyState>
            <!-- grid 显示模式 -->
            <div 
                v-if="display === 'grid'" 
                class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 place-items-center mx-auto w-fit md:w-auto"
            >
                <GridItemCard 
                    v-for="item in items" 
                    :key="item.id" 
                    :item="item" 
                >
                    <NuxtLink :to='`/tasks/${item.slug}`'>
                        <Button 
                            aria-label="favorite"
                            variant="secondary"
                            class="absolute top-0.5 right-0.5 md:top-1 md:right-1 !p-1.5 h-fit !w-fit !ring-0"
                        > 
                            <ClientOnly>
                                <IconsBookmark
                                    variant="solid"
                                />
                                <template #fallback>
                                    <IconsBookmark
                                        variant="solid"
                                        class="text-transparent stroke-white !size-5 transition duration-200"
                                    />
                                </template>
                            </ClientOnly>
                        </Button>
                    </NuxtLink>
                </GridItemCard>
            </div>
            <!-- list 显示模式 -->
            <div 
                v-else-if="display === 'list'" 
                class="flex flex-col gap-2 md:gap-3"
            >
                <ListItemCard 
                    v-for="item in items" 
                    :key="item.id" 
                    :item="item"
                >   
                    <!-- 查看详情和添加按钮 -->
                    <div class="hidden md:flex flex-col justify-center shrink-0 gap-2 mr-5 w-40">
                        <NuxtLink :to='`/exp/${item.slug}`'>
                            <Button 
                            size="small"
                            > 
                                <span>查看详情</span>
                                <IconsDoubleChevronRight class="!size-3.5" />
                            </Button>
                        </NuxtLink>
                        <NuxtLink :to='`/tasks/${item.slug}`'>
                            <Button 
                                aria-label="favorite"
                                size="small"
                                variant="secondary" 
                            > 
                                <ClientOnly>
                                    <IconsBookmark
                                        variant="solid"
                                    />
                                    <template #fallback>
                                        <IconsBookmark
                                            variant="solid"
                                            class="text-transparent stroke-white !size-5 transition duration-200"
                                        />
                                    </template>
                                </ClientOnly>
                                <span>参加实验</span>
                            </Button>
                        </NuxtLink>
                    </div>
                    <!-- 手机屏幕下 仅显示favorite图标 -->
                    <div class="md:hidden absolute bottom-1 right-1">
                        <NuxtLink :to='`/exp/${item.slug}`'>
                            <Button 
                                aria-label="favorite"
                                variant="secondary" 
                                class="!p-[7px]"
                            > 
                                <ClientOnly>
                                    <IconsBookmark
                                        variant="solid"
                                    />
                                    <template #fallback>
                                        <IconsBookmark
                                            variant="solid"
                                            class="text-transparent stroke-white !size-[18px] transition duration-200"
                                        />
                                    </template>
                                </ClientOnly>
                            </Button>
                        </NuxtLink>
                    </div>
                </ListItemCard>
            </div>
            <!-- 底部 loading 显示-->
            <div 
                v-if="loading"
                class="flex w-full items-center justify-center gap-1 my-4 mt-8 md:mt-10 lg:mt-12"
            >
                <IconsSpinner class="size-5 text-white animate-spin mr-1" />
                <h1 class="text-xl text-center text-white">
                    Loading more items...
                </h1>
            </div>
        </div>
    </div>
</template>

<style scoped>

.underline-effect {
    position: relative;
}
.underline-effect::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background-color: #D4171E;
    bottom: 0;
    left: 0;
    transform-origin: right;
    transform: scaleX(0);
    transition: transform .4s;
}
@media screen and (max-width: 640px) {
    .underline-effect::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 3px;
        border-radius: 4px;
        background-color: #D4171E;
        bottom: 0;
        left: 0;
        transform-origin: right;
        transform: scaleX(0);
        transition: transform .4s;
    }
}
.underline-effect:hover::before {
    transform-origin: left;
    transform: scaleX(1);
}

.swiper {
    --swiper-pagination-color: #FB4242;
    --swiper-pagination-left: auto;
    --swiper-pagination-right: 8px;
    --swiper-pagination-bottom: 8px;
    --swiper-pagination-top: auto;
    --swiper-pagination-fraction-color: inherit;
    --swiper-pagination-progressbar-bg-color: rgba(0, 0, 0, 0.25);
    --swiper-pagination-progressbar-size: 4px;
    --swiper-pagination-bullet-size: 8px;
    --swiper-pagination-bullet-width: 8px;
    --swiper-pagination-bullet-height: 8px;
    --swiper-pagination-bullet-inactive-color: #171717;
    --swiper-pagination-bullet-inactive-opacity: 0.75;
    --swiper-pagination-bullet-opacity: 1;
    --swiper-pagination-bullet-horizontal-gap: 4px;
    --swiper-pagination-bullet-vertical-gap: 6px;
}

</style>