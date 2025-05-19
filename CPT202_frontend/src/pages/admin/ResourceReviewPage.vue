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
    <player-bar />
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
  background-color: #fff;
  min-height: 100vh;
}

/* 黑夜模式样式 */
[data-theme='dark'] #ResourceReviewPage {
  background-color: #121212;
  color: rgba(255, 255, 255, 0.85);
}

/* 表格黑夜模式样式 */
[data-theme='dark'] #ResourceReviewPage .ant-table {
  background-color: #1e1e1e;
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] #ResourceReviewPage .ant-table-thead > tr > th {
  background-color: #141414;
  color: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid #303030;
}

[data-theme='dark'] #ResourceReviewPage .ant-table-tbody > tr > td {
  border-bottom: 1px solid #303030;
}

/* 标签页黑夜模式样式 */
[data-theme='dark'] #ResourceReviewPage .ant-tabs-tab {
  color: rgba(255, 255, 255, 0.65);
}

[data-theme='dark'] #ResourceReviewPage .ant-tabs-tab-active .ant-tabs-tab-btn {
  color: #177ddc;
}

[data-theme='dark'] #ResourceReviewPage .ant-tabs-ink-bar {
  background: #177ddc;
}

[data-theme='dark'] #ResourceReviewPage .ant-tabs-nav::before {
  border-bottom: 1px solid #303030;
}

/* 分页器黑夜模式样式 */
[data-theme='dark'] #ResourceReviewPage .ant-pagination-item {
  background-color: #1e1e1e;
  border-color: #303030;
}

[data-theme='dark'] #ResourceReviewPage .ant-pagination-item a {
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] #ResourceReviewPage .ant-pagination-item-active {
  background-color: #177ddc;
  border-color: #177ddc;
}

[data-theme='dark'] #ResourceReviewPage .ant-pagination-prev button,
[data-theme='dark'] #ResourceReviewPage .ant-pagination-next button {
  background-color: #1e1e1e;
  color: rgba(255, 255, 255, 0.85);
  border-color: #303030;
}

/* 按钮黑夜模式样式 */
[data-theme='dark'] #ResourceReviewPage .ant-btn {
  background-color: #1f1f1f;
  border-color: #434343;
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] #ResourceReviewPage .ant-btn:hover {
  background-color: #303030;
  border-color: #177ddc;
}

[data-theme='dark'] #ResourceReviewPage .ant-btn-primary {
  background-color: #177ddc;
  border-color: #177ddc;
  color: #fff;
}

[data-theme='dark'] #ResourceReviewPage .ant-btn-primary:hover {
  background-color: #165996;
  border-color: #165996;
}

/* 模态框黑夜模式样式 */
[data-theme='dark'] .ant-modal-content,
[data-theme='dark'] .ant-modal-header {
  background-color: #1f1f1f;
  color: rgba(255, 255, 255, 0.85);
  border-color: #303030;
}

[data-theme='dark'] .ant-modal-title {
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-modal-close {
  color: rgba(255, 255, 255, 0.45);
}

[data-theme='dark'] .ant-modal-close:hover {
  color: rgba(255, 255, 255, 0.75);
}

[data-theme='dark'] .ant-modal-footer {
  border-top-color: #303030;
}

/* 表单黑夜模式样式 */
[data-theme='dark'] .ant-form-item-label > label {
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-input,
[data-theme='dark'] .ant-textarea {
  background-color: #141414;
  border-color: #434343;
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-input:hover,
[data-theme='dark'] .ant-textarea:hover {
  border-color: #165996;
}

[data-theme='dark'] .ant-input:focus,
[data-theme='dark'] .ant-input-focused,
[data-theme='dark'] .ant-textarea:focus,
[data-theme='dark'] .ant-textarea-focused {
  border-color: #177ddc;
  box-shadow: 0 0 0 2px rgba(23, 125, 220, 0.2);
}

/* 描述列表黑夜模式样式 */
[data-theme='dark'] .ant-descriptions-bordered .ant-descriptions-item-label,
[data-theme='dark'] .ant-descriptions-bordered .ant-descriptions-item-content {
  background-color: #1f1f1f;
  border-color: #303030;
  color: rgba(255, 255, 255, 0.85);
}
</style>

<!-- 添加全局样式（不使用scoped）以覆盖Ant Design的默认行为 -->
<style>
/* 禁用黑夜模式下的表格行悬停效果 */
[data-theme='dark'] .ant-table-tbody > tr.ant-table-row:hover,
[data-theme='dark'] .ant-table-tbody > tr.ant-table-row:hover > td,
[data-theme='dark'] .ant-table-tbody > tr:hover,
[data-theme='dark'] .ant-table-tbody > tr:hover > td,
[data-theme='dark'] .ant-table-tbody > tr.ant-table-row-hover,
[data-theme='dark'] .ant-table-tbody > tr.ant-table-row-hover > td,
[data-theme='dark'] .ant-table-tbody > tr > td.ant-table-cell-row-hover {
  background-color: transparent !important;
}
</style>
