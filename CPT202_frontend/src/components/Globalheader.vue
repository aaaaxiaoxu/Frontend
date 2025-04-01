<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="300px">
        <router-link to="/">
          <div class="title-bar">
            <img src="../assets/logo.svg" alt="logo" class="logo" />
            <div class="title">MelodyHub</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doMenuClick"/>
      </a-col>
      <a-col flex="120px">
        <div class="user-login-status">
          <a-button type="primary" href="/user/login">
            Login
          </a-button>
        </div>
      </a-col>
    </a-row>

  </div>
</template>


<script lang="ts" setup>
import { h, ref } from 'vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import { MenuProps } from 'ant-design-vue'
import {useRouter} from "vue-router";

const current = ref<string[]>([])
const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/about',
    label: 'about',
    title: 'about',
  },
  {
    key: 'others',
    label: '吴云峰大牛',
    title: '吴云峰',
  },
])


const router = useRouter();
//路由跳转事件
const doMenuClick = ({key}) => {
  router.push({
    path: key
  })
}

// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, next) => {
  current.value = [to.path];
});


</script>


<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;

}
</style>

