import { ref } from "vue"

export const useField = (value = '') => {
    const field = ref(value)
    const error = ref()

    return { field, error }
}