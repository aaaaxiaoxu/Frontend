<template>
  <div id="ResourceReviewPage">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="pending" :tab="t('message.pending')">
        <resource-review-table :status="0" @refresh="fetchPendingData" ref="pendingTableRef" />
      </a-tab-pane>
      <a-tab-pane key="approved" :tab="t('message.approved')">
        <resource-review-table :status="1" @refresh="fetchApprovedData" ref="approvedTableRef" />
      </a-tab-pane>
      <a-tab-pane key="rejected" :tab="t('message.rejected')">
        <resource-review-table :status="2" @refresh="fetchRejectedData" ref="rejectedTableRef" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ResourceReviewTable from '@/components/admin/ResourceReviewTable.vue'
import { useI18n } from 'vue-i18n'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'

// i18n
const { t } = useI18n()

const activeTab = ref('pending')
const pendingTableRef = ref()
const approvedTableRef = ref()
const rejectedTableRef = ref()

// 获取待审核数据
const fetchPendingData = () => {
  if (pendingTableRef.value) {
    pendingTableRef.value.fetchData()
  }
}

// 获取已通过数据
const fetchApprovedData = () => {
  if (approvedTableRef.value) {
    approvedTableRef.value.fetchData()
  }
}

// 获取已拒绝数据
const fetchRejectedData = () => {
  if (rejectedTableRef.value) {
    rejectedTableRef.value.fetchData()
  }
}
</script>

<style scoped>
#ResourceReviewPage {
  padding: 24px;
}
</style>
