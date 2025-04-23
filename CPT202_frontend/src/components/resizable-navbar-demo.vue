<script setup lang="ts">
import { ref, defineComponent } from 'vue'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizeble-navbar/resizable-navbar.vue'

const navItems = [
  {
    name: "Features",
    link: "#features",
  },
  {
    name: "Pricing",
    link: "#pricing",
  },
  {
    name: "Contact",
    link: "#contact",
  },
]

const isMobileMenuOpen = ref(false)

// 独立的示例内容组件
const DummyContent = defineComponent({
  setup() {
    const boxes = [
      {
        id: 1,
        title: "The",
        width: "md:col-span-1",
        height: "h-60",
        bg: "bg-neutral-100 dark:bg-neutral-800",
      },
      {
        id: 2,
        title: "First",
        width: "md:col-span-2",
        height: "h-60",
        bg: "bg-neutral-100 dark:bg-neutral-800",
      },
      {
        id: 3,
        title: "Rule",
        width: "md:col-span-1",
        height: "h-60",
        bg: "bg-neutral-100 dark:bg-neutral-800",
      },
      {
        id: 4,
        title: "Of",
        width: "md:col-span-3",
        height: "h-60",
        bg: "bg-neutral-100 dark:bg-neutral-800",
      },
      {
        id: 5,
        title: "F",
        width: "md:col-span-1",
        height: "h-60",
        bg: "bg-neutral-100 dark:bg-neutral-800",
      },
      {
        id: 6,
        title: "Club",
        width: "md:col-span-2",
        height: "h-60",
        bg: "bg-neutral-100 dark:bg-neutral-800",
      },
      {
        id: 7,
        title: "Is",
        width: "md:col-span-2",
        height: "h-60",
        bg: "bg-neutral-100 dark:bg-neutral-800",
      },
      {
        id: 8,
        title: "You",
        width: "md:col-span-1",
        height: "h-60",
        bg: "bg-neutral-100 dark:bg-neutral-800",
      },
      {
        id: 9,
        title: "Do NOT TALK about",
        width: "md:col-span-2",
        height: "h-60",
        bg: "bg-neutral-100 dark:bg-neutral-800",
      },
      {
        id: 10,
        title: "F Club",
        width: "md:col-span-1",
        height: "h-60",
        bg: "bg-neutral-100 dark:bg-neutral-800",
      },
    ]

    return { boxes }
  },
  template: `
    <div class="container mx-auto p-8 pt-24">
      <h1 class="mb-4 text-center text-3xl font-bold">
        查看容器顶部的导航栏
      </h1>
      <p class="mb-10 text-center text-sm text-zinc-500">
        出于演示目的，我们将位置设置为
        <span class="font-medium">Sticky</span>。
        请记住，此组件是
        <span class="font-medium">固定的</span>，
        滚动时不会移动。
      </p>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div
          v-for="box in boxes"
          :key="box.id"
          :class="[box.width, box.height, box.bg, 'flex items-center justify-center rounded-lg p-4 shadow-sm']"
        >
          <h2 class="text-xl font-medium">{{ box.title }}</h2>
        </div>
      </div>
    </div>
  `
})
</script>

<template>
  <div class="relative w-full">
    <Navbar>
      <!-- 桌面导航 -->
      <NavBody>
        <NavbarLogo />
        <NavItems :items="navItems" />
        <div class="flex items-center gap-4">
          <NavbarButton variant="secondary">登录</NavbarButton>
          <NavbarButton variant="primary">预约通话</NavbarButton>
        </div>
      </NavBody>

      <!-- 移动端导航 -->
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            :is-open="isMobileMenuOpen"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          />
        </MobileNavHeader>

        <MobileNavMenu
          :is-open="isMobileMenuOpen"
          @close="isMobileMenuOpen = false"
        >
          <a
            v-for="(item, idx) in navItems"
            :key="`mobile-link-${idx}`"
            :href="item.link"
            @click="isMobileMenuOpen = false"
            class="relative text-neutral-600 dark:text-neutral-300"
          >
            <span class="block">{{ item.name }}</span>
          </a>
          <div class="flex w-full flex-col gap-4">
            <NavbarButton
              @click="isMobileMenuOpen = false"
              variant="primary"
              class="w-full"
            >
              登录
            </NavbarButton>
            <NavbarButton
              @click="isMobileMenuOpen = false"
              variant="primary"
              class="w-full"
            >
              预约通话
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>

    <DummyContent />
  </div>
</template>
