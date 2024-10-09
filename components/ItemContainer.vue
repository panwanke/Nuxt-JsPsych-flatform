<script setup>

const props = defineProps({
    item: Object
})


const size = ref()
const route = useRoute()
const task_path = ref(route.path.replace('/exp/','/tasks/'))

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
                <NuxtLink 
                    :to="task_path"
                    :tag="item.isDone ? 'span' : 'a'"
                    class="w-full"
                    :class="{ disabled: item.isDone }"
                >
                    <Button
                        size="medium"
                        variant="secondary"
                        class="xl:h-16"
                        >
                        <IconsShoppingCart class="!size-4 sm:!size-5" />
                        <span>  {{ item.isDone? "已完成(无法再次参与)": "现在参与" }}  </span>
                    </Button>
                </NuxtLink>

            </div>
        </div>
    </div>
</template>