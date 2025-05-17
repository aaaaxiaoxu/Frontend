<template>
  <button :class="cn(
  'relative flex items-center justify-center min-w-28 min-h-10 overflow-hidden before:absolute before:-inset-[200%] animate-rainbow rainbow-btn',
  props.class,
)">
    <span class="btn-content inline-flex size-full items-center justify-center px-4 py-2">
      <slot />
    </span>
  </button>
</template>

<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { computed, onMounted, ref, watch } from 'vue';
import { useThemeStore } from '@/stores/useThemeStore';

interface GradientButtonProps {
  borderWidth?: number;
  colors?: string[];
  duration?: number;
  borderRadius?: number;
  blur?: number;
  class?: string;
  bgColor?: string;
}

const props = withDefaults(defineProps<GradientButtonProps>(), {
  colors: () => [
    '#FF0000',
    '#FFA500',
    '#FFFF00',
    '#008000',
    '#0000FF',
    '#4B0082',
    '#EE82EE',
    '#FF0000',
  ],
  duration: 2500,
  borderWidth: 2,
  borderRadius: 8,
  blur: 4,
  bgColor: '#000',
});

const themeStore = useThemeStore();
const currentBgColor = ref(props.bgColor);

// 监听主题变化或bgColor属性变化
watch(() => [themeStore.theme, props.bgColor], ([newTheme]) => {
  currentBgColor.value = newTheme === 'dark' ? '#000' : '#fff';
});

// 初始化时设置正确的背景色
onMounted(() => {
  currentBgColor.value = themeStore.theme === 'dark' ? '#000' : '#fff';
});

const durationInMilliseconds = computed(() => `${props.duration}ms`);
const allColors = computed(() => props.colors.join(', '));
const borderWidthInPx = computed(() => `${props.borderWidth}px`);
const borderRadiusInPx = computed(() => `${props.borderRadius}px`);
const blurPx = computed(() => `${props.blur}px`);
</script>

<style scoped>
.animate-rainbow::before {
  content: "";
  background: conic-gradient(v-bind(allColors));
  animation: rotate-rainbow v-bind(durationInMilliseconds) linear infinite;
  filter: blur(v-bind(blurPx));
  padding: v-bind(borderWidthInPx);
}

.rainbow-btn {
  padding: v-bind(borderWidthInPx);
  border-radius: v-bind(borderRadiusInPx);
}

.btn-content {
  border-radius: v-bind(borderRadiusInPx);
  background-color: v-bind(currentBgColor);
  z-index: 0;
  transition: background-color 0.3s ease, color 0.3s ease;
}

@keyframes rotate-rainbow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
