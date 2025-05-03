export const useApiFetch = () => {
    const baseApi = 'http://localhost:5001/api'

    const makeRequest = async (url, params) => {
        await fetch(baseApi + url)
    }
}