type AlertType = 'success' | 'error' | 'warning' | 'info'

interface Alert {
  text: string
  type: AlertType
}

export const useAlert = () => {
  const data = useState<Alert | null>(
    'alert',
    () => null
  )

  const active = computed(
    () => data.value !== null
  )

  const show = (
    text: string,
    type: AlertType
  ) => {
    data.value = {
      text,
      type
    }
  }

  const clear = () => {
    data.value = null
  }

  return {
    data,
    active,
    show,
    clear
  }
}
