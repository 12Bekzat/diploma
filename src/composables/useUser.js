import { useMainStore } from "@/stores/mainStore"
import { useApiFetch } from "@/utils/apiFetch"
import { storeToRefs } from "pinia"
import { ref } from "vue"

export const useUser = () => {
    const users = ref([
        {
            id: 1,
            firstName: 'User',
            secondName: 'User',
            roles: ['USER'],
            logoSrc: 'https://99designs-blog.imgix.net/blog/wp-content/uploads/2022/06/Starbucks_Corporation_Logo_2011.svg-e1657703028844.png?auto=format&q=60&fit=max&w=930',
            username: 'user12',
            password: 'user123'
        },
        {
            id: 0,
            firstName: 'Admin',
            secondName: 'Admin',
            roles: ['ADMIN'],
            logoSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ584acfWMPuHP7nRm1z5_Yt5zLmKyGrANsQ&s',
            username: 'admin',
            password: 'admin123'
        },
    ])

    const mainStore = useMainStore()
    const { currentUser } = storeToRefs(mainStore)

    const login = async (username, password) => {
        const { anyRequest } = useApiFetch()

        const response = await anyRequest('/login', { username, password })
        if (!response?.token) {
            console.log('Error in login when login syystem');
            
            return false
        }
        localStorage.setItem('jwt_token', response?.token)
        return true
    }

    const getMe = async () => {
        const { makeRequest } = useApiFetch()

        const response = await makeRequest('/users/me')
        currentUser.value = response
    }

    return {
        login, getMe
    }
}