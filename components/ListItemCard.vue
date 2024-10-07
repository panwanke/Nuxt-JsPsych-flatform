<script setup>

const props = defineProps({
    item: Object
})

</script>

<template>
    <div class="relative flex justify-between w-full p-1 lg:p-1.5 rounded-2xl bg-gray-dark">
        <div class="flex w-full md:mr-10 lg:mr-20">
            <NuxtLink :to='`/exp/${item?.slug}`' class="shrink-0">
                <NuxtImg 
                    :src="item?.photoUrl" 
                    :alt="item?.name" 
                    class="size-32 md:size-44 object-cover rounded-xl" 
                    preload 
                />
            </NuxtLink>
            <div class="flex flex-col w-full justify-between overflow-hidden text-white my-1 md:my-2 mr-2 ml-4 md:ml-6">
                <div>
                    <NuxtLink :to='`/exp/${item?.slug}`'>
                        <p class="font-light text-base md:text-lg truncate w-full"> 
                            {{ item?.name }}
                        </p>
                        <p> 
                            {{ item?.description }}
                        </p>
                    </NuxtLink>
                    <div class="flex items-center my-1 md:my-1.5 gap-1.5">
                        <Rating :rating="item?.rating || 0" />
                        <p class="text-gray-lightest"> 
                            ({{ item?.reviews?.length }}) 
                        </p>
                    </div>
                </div>
                <div class="text-base md:text-lg whitespace-nowrap">
                    <span> {{ item.remuneration }} </span>
                    <span class="font-extralight">元</span>
                </div>
            </div>
        </div>
        <slot />
    </div>
</template>
