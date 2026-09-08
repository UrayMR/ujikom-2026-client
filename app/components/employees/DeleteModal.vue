<script setup lang="ts">
const props = withDefaults(defineProps<{
  count?: number
  selectedIds?: number[]
}>(), {
  count: 0,
  selectedIds: () => []
})

const emit = defineEmits<{
  deleted: []
}>()

const toast = useToast()
const open = ref(false)
const loading = ref(false)

async function onSubmit() {
  if (!props.selectedIds.length) {
    open.value = false
    return
  }

  loading.value = true

  try {
    await useFetchForm('/employees/bulk', {
      method: 'DELETE',
      body: {
        ids: props.selectedIds
      }
    })

    emit('deleted')

    toast.add({
      title: 'Employees deleted',
      description: `${props.count} employee${props.count > 1 ? 's' : ''} have been deleted.`
    })

    open.value = false
  } catch {
    toast.add({
      title: 'Error deleting employees',
      description: 'An error occurred while deleting employees. Please try again.',
      color: 'error'
    })

    open.value = false
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Delete ${count} employee${count > 1 ? 's' : ''}`"
    :description="`Are you sure, this action cannot be undone.`"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          :disabled="loading"
          @click="open = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          :loading="loading"
          :disabled="loading || !selectedIds.length"
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
