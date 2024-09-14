<script setup>
const navItems = [
    { id: 'home',      name: '发布',      icon: 'home',          url: '/'               },
    { id: 'shop',      name: '已参与',      icon: 'shopping-bag',  url: '/user/myexp'           },
    { id: 'about',     name: '我的',     icon: 'document',      url: '/user/account'          },
]
</script>

<template>
    <div class="fixed w-screen top-0 z-50 h-16 bg-gray-dark shadow-lg">
        <div class="flex gap-x-3 items-center justify-center mx-auto h-full">
            <NavItem
                v-for="item in navItems"
                :key="item.id"
                :label="item.name" 
                :url="item.url"
                :id="item.id"
            />
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
    height: 2px;
    border-radius: 100px;
    background-color: #D4171E;
    bottom: 0;
    left: 0;
    transform-origin: right;
    transform: scaleX(0);
    transition: transform .4s;
}
.underline-effect:hover::before {
    transform-origin: left;
    transform: scaleX(1);
}

</style>
