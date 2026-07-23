<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import EditUmkmModal from './modals/EditUmkmModal.vue'
import ManageUserModal from './modals/ManageUserModal.vue'
import SubmissionDetailModal from './modals/SubmissionDetailModal.vue'
import ReplyReviewModal from './modals/ReplyReviewModal.vue'

const ui = useUiStore()
</script>

<template>
  <EditUmkmModal v-if="ui.modalKind === 'editUmkm'" />
  <ManageUserModal v-else-if="ui.modalKind === 'manageUser'" />
  <SubmissionDetailModal v-else-if="ui.modalKind === 'submissionDetail'" />
  <ReplyReviewModal v-else-if="ui.modalKind === 'replyReview'" />
</template>
