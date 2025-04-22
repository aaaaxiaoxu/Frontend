<!-- Uses base code from shadcn-vue Input component and extends it's functionality-->
<template>
  <div
    ref="inputContainerRef"
    :class="cn('group/input rounded-lg p-[2px] transition duration-300', props.containerClass)"
    :style="{
      background: containerBg,
    }"
    @mouseenter="() => (visible = true)"
    @mouseleave="() => (visible = false)"
    @mousemove="handleMouseMove"
  >
    <!-- 当类型不是password时使用普通input -->
    <input
      v-if="type !== 'password'"
      v-bind="$attrs"
      :type="type"
      v-model="modelValue"
      :class="
        cn(
          `flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
          file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
          focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
           disabled:cursor-not-allowed disabled:opacity-50
           dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
           group-hover/input:shadow-none transition duration-400`,
          props.class,
        )
      "
    />
    
    <!-- 当类型是password时使用带有切换可见性按钮的输入框 -->
    <div v-else class="relative w-full">
      <input
        :type="passwordVisible ? 'text' : 'password'"
        v-bind="$attrs"
        v-model="modelValue"
        :class="
          cn(
            `flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
            file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
            focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
             disabled:cursor-not-allowed disabled:opacity-50
             dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
             group-hover/input:shadow-none transition duration-400 pr-10`,
            props.class,
          )
        "
      />
      <button 
        type="button" 
        class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition"
        @click="togglePasswordVisibility"
      >
        <svg 
          v-if="passwordVisible" 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg 
          v-else 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { useVModel } from '@vueuse/core';
import { ref, computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
  containerClass?: HTMLAttributes["class"];
  type?: string; // 新增type属性，用于区分密码输入框
}>();

// 默认值设置
const defaultProps = {
  type: 'text'
};

// 合并默认值
const finalProps = { ...defaultProps, ...props };

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const inputContainerRef = ref<HTMLDivElement | null>(null);
const mouse = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const radius = 100; // 调整此值可以改变蓝色光晕的大小
const visible = ref(false);
const passwordVisible = ref(false); // 用于控制密码可见性

// 切换密码可见性的函数
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

// 计算出的背景渐变，这是实现鼠标跟随效果的关键
const containerBg = computed(() => {
  return `
        radial-gradient(
          ${visible.value ? radius + 'px' : '0px'} circle at ${mouse.value.x}px ${mouse.value.y}px,
          var(--blue-500),
          transparent 80%
        )
      `;
});

// 处理鼠标移动，更新鼠标位置
function handleMouseMove({ clientX, clientY }: MouseEvent) {
  if (!inputContainerRef.value) return;

  const { left, top } = inputContainerRef.value.getBoundingClientRect();
  mouse.value = { x: clientX - left, y: clientY - top };
}
</script>

<style scoped>
:root {
  --blue-500: rgba(59, 130, 246, 0.5); /* 设置蓝色光晕的颜色和透明度 */
}

input {
  box-shadow:
    0px 2px 3px -1px rgba(0, 0, 0, 0.1),
    0px 1px 0px 0px rgba(25, 28, 33, 0.02),
    0px 0px 0px 1px rgba(25, 28, 33, 0.08);
}

/* 确保光晕效果在所有浏览器中都正常显示 */
.group\/input {
  position: relative;
  z-index: 0;
  overflow: hidden;
}
</style>
