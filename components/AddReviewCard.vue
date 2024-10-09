<script setup>

const bus = useEventBus('modal')

const rating = ref(0)
const hoverRating = ref(0)

</script>

<template>
    <div>
        <div class="flex flex-col items-center gap-2 p-3 w-full rounded-2xl bg-gray-dark text-white">
            <p class="text-lg sm:text-xl"> 
                添加评论
            </p>
            <p class="text-sm font-light max-w-xl text-center"> 
                请添加评论让其他参与者了解你对该实验的看法。
            </p>
            <div 
                class="hidden md:flex hover:cursor-pointer w-fit mx-auto" 
                @mouseleave="() => hoverRating = rating"
            >
                <template v-for="n in parseInt(hoverRating)">
                    <IconsStar 
                        class="text-yellow-primary !size-7" 
                        @mouseover="() => hoverRating = n" 
                        @click="() => rating = hoverRating" 
                    />
                </template>
                <template v-for="n in 5 - parseInt(hoverRating)">
                    <IconsStar 
                        class="text-gray-light !size-7" 
                        @mouseover="() => hoverRating = hoverRating + n" 
                        @click="() => rating = hoverRating" 
                    />
                </template>
            </div>
            <Button 
                @click="() => bus.emit('addReview', { rating: rating })" 
                variant="secondary" 
                size="small" 
                class="mt-1 max-w-32 sm:max-w-40"
            > 
                <IconsReview class="!size-4 sm:!size-5" />
                <span> 添加评论 </span>
            </Button>
        </div>
    </div>
</template>
