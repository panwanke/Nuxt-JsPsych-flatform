<script setup>

import { useToast } from 'vue-toastification'

const props = defineProps({
    item: Object,
    isFavorite: Boolean
})

const emit = defineEmits(['toggleFavorite'])

// const route = useRoute()
// const toast = useToast()

// const cart = useCart()

const size = ref()
const route = useRoute()
const task_path = ref(route.path.replace('/exp/','/tasks/'))
// console.log('task_path',task_path.value)
// const addToCart = useDebounceFn(async () => {
//     try {
//         await cart.addItem(route.params.id, size.value, props.item.sizes.length)
//     } 
//     catch(e) {
//         toast.error(e.statusMessage)
//     }
// })

</script>

<template>
    <div class="grid grid-cols-4 gap-2 md:gap-3">
        <!-- 图片和描述 -->
        <div class="flex flex-col sm:flex-row col-span-4 xl:col-span-3 p-1 lg:p-1.5 bg-gray-dark rounded-2xl">
            <NuxtImg 
                :src="item.photoUrl" 
                :alt="item.name" 
                class="w-full sm:size-[320px] md:size-[360px] lg:size-[420px] object-cover rounded-xl" 
                preload
            />
            <div class="flex flex-col justify-center gap-1 md:gap-2 lg:gap-6 text-white py-5 sm:py-4 px-5 md:pl-6">
                <div class="flex flex-col gap-1 sm:gap-2">
                    <h1 class="text-xl lg:text-2xl text-white">
                        {{ item.name }}
                    </h1>

                    <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p class="text-lg lg:text-xl"> 
                            {{ parseFloat(item.rating).toFixed(2) }}
                        </p>
                        <Rating :rating="item.rating" class="mb-0.5" />
                        <p class="lg:text-lg text-gray-lightest font-light"> 
                            ({{ item.reviews.length }} 条评论) 
                        </p>
                    </div>
                </div>

                <div class="flex flex-col">
                    <p class="text-lg lg:text-xl w-full"> 
                        描述
                    </p>
                    <p class="lg:text-lg font-light text-gray-lightest w-full"> 
                        {{ item.description }} 
                    </p>
                </div>

                <div v-if="item?.sizes?.length" class="flex flex-col">
                    <p class="text-lg lg:text-xl w-full"> 
                        Sizes
                    </p>
                    <Select 
                        v-model="size"
                        :options="item.sizes"
                        class="mt-2"
                    />
                </div>
            </div>
        </div>
        <!-- 费用和按钮 -->
        <div class="col-span-4 xl:col-span-1 p-6 flex flex-col gap-4 bg-gray-dark rounded-2xl text-white">
            <!-- 费用 -->
            <div class="text-xl lg:text-2xl flex items-center justify-center"> 
                <span class="font-extralight">被试费： </span>
                <span> {{ item.remuneration }} </span>
                <span class="pl-2"> 元 </span>
            </div>
            <!-- 按钮 -->
            <div class="flex flex-row xl:flex-col xl:justify-around gap-4 xl:gap-0 h-full">
                <!-- TODO: change nuxtlink -->
                <NuxtLink :to="task_path" class="w-full">
                    <Button
                        size="medium"
                        variant="secondary"
                        class="xl:h-16"
                        >
                        <IconsShoppingCart class="!size-4 sm:!size-5" />
                        <span> 现在参与 </span>
                    </Button>
                </NuxtLink>
                <Button
                    @click="emit('toggleFavorite')" 
                    size="medium"
                    aria-label="favorite"
                    class="xl:h-16"
                > 
                    <ClientOnly>
                        <IconsBookmark
                            variant="solid"
                            :class="[
                                isFavorite ? 'stroke-gray-primary' : 'text-transparent stroke-white',
                                '!size-4 sm:!size-5 transition duration-200'
                            ]"
                        />
                        <template #fallback>
                            <IconsBookmark
                                variant="solid"
                                class="text-transparent stroke-white !size-4 sm:!size-5 transition duration-200"
                            />
                        </template>
                    </ClientOnly>
                    <span> {{ isFavorite ? '已收藏或已参与' : '收藏后再参与' }} </span>
                </Button>
            </div>
        </div>
    </div>
</template>