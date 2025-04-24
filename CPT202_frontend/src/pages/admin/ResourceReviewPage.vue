<template>
  <div id="ResourceReviewPage">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="pending" tab="Pending">
        <resource-review-table :status="0" @refresh="fetchPendingData" ref="pendingTableRef" />
      </a-tab-pane>
      <a-tab-pane key="approved" tab="Approved">
        <resource-review-table :status="1" @refresh="fetchApprovedData" ref="approvedTableRef" />
      </a-tab-pane>
      <a-tab-pane key="rejected" tab="Rejected">
        <resource-review-table :status="2" @refresh="fetchRejectedData" ref="rejectedTableRef" />
      </a-tab-pane>
    </a-tabs>
    <player-bar />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ResourceReviewTable from '@/components/admin/ResourceReviewTable.vue'
import PlayerBar from '@/components/PlayerBar.vue'

const activeTab = ref('pending')
const pendingTableRef = ref()
const approvedTableRef = ref()
const rejectedTableRef = ref()

// Get pending review data
const fetchPendingData = () => {
  if (pendingTableRef.value) {
    pendingTableRef.value.fetchData()
  }
}

// Get approved data
const fetchApprovedData = () => {
  if (approvedTableRef.value) {
    approvedTableRef.value.fetchData()
  }
}

// Get rejected data
const fetchRejectedData = () => {
  if (rejectedTableRef.value) {
    rejectedTableRef.value.fetchData()
  }
}
</script>

<style scoped>
#ResourceReviewPage {
  padding: 24px;
  padding-bottom: 70px; /* Space for bottom player */
}
</style>
