<script setup lang="ts">
const props = withDefaults(defineProps<{
  count?: number
  selectedIds?: number[]
  singleId?: number
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

defineExpose({
  openModal: () => { open.value = true }
})

async function onSubmit() {
  const idsToDelete = props.singleId ? [props.singleId] : props.selectedIds
  const totalCount = props.singleId ? 1 : props.count

  if (!idsToDelete.length) {
    open.value = false
    return
  }

  loading.value = true

  try {
    if (props.singleId) {
      await useFetchForm(`/employees/${props.singleId}`, {
        method: 'DELETE'
      })
    } else {
      await useFetchForm('/employees/bulk', {
        method: 'DELETE',
        body: { ids: idsToDelete }
      })
    }

    emit('deleted')

    toast.add({
      title: 'Employee deleted',
      description: `${totalCount} employee record has been deleted.`
    })

    open.value = false
  } catch {
    open.value = false
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="singleId ? 'Delete employee' : `Delete ${count} employees`"
    description="Are you sure, this action cannot be undone."
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
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
