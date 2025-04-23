<template>
  <component
    :is="componentTag"
    ref="elementRef"
    :class="['text-4xl font-bold leading-[5rem] tracking-[-0.02em]', className]"
  >
    {{ displayedText }}
  </component>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

interface Props {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  componentTag?: string;
  startOnView?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  duration: 100,
  delay: 0,
  componentTag: 'div',
  startOnView: false
});

const displayedText = ref('');
const started = ref(false);
const elementRef = ref<HTMLElement | null>(null);
let typingEffect: number | undefined;

onMounted(() => {
  if (!props.startOnView) {
    const startTimeout = setTimeout(() => {
      started.value = true;
    }, props.delay);
    
    onUnmounted(() => clearTimeout(startTimeout));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            started.value = true;
          }, props.delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.value) {
      observer.observe(elementRef.value);
    }

    onUnmounted(() => observer.disconnect());
  }
});

watch(started, (newValue) => {
  if (!newValue) return;
  
  let i = 0;
  typingEffect = setInterval(() => {
    if (i < props.text.length) {
      displayedText.value = props.text.substring(0, i + 1);
      i++;
    } else {
      clearInterval(typingEffect);
    }
  }, props.duration) as unknown as number;
});

watch(() => props.text, () => {
  if (started.value) {
    displayedText.value = '';
    clearInterval(typingEffect);
    
    let i = 0;
    typingEffect = setInterval(() => {
      if (i < props.text.length) {
        displayedText.value = props.text.substring(0, i + 1);
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, props.duration) as unknown as number;
  }
});

onUnmounted(() => {
  if (typingEffect) clearInterval(typingEffect);
});
</script>