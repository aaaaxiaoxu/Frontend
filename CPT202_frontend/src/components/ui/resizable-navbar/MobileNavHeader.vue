<script setup lang="ts">
const props = defineProps<{
  className?: string
}>();
</script>

<template>
  <div :class="['flex w-full flex-row items-center justify-between', props.className]">
    <slot></slot>
  </div>
</template>
