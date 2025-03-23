<template>
  <div id="globalHeader">
    <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" />
  </div>
</template>


<script lang="ts" setup>
import { h, ref } from 'vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import { MenuProps } from 'ant-design-vue'

const current = ref<string[]>(['home'])
const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/about',
    label: '吴云峰小牛',
    title: '吴云峰',
  },
  {
    key: 'others',
    label: '吴云峰大牛',
    title: '吴云峰',
  },
])
</script>


