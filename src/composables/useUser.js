import { useMainStore } from "@/stores/mainStore"
import { storeToRefs } from "pinia"
import { ref } from "vue"

export const useUser = () => {
    const users = [
        {
            id: 0,
            firstName: 'User',
            secondName: 'User',
            roles: ['USER'],
            logoSrc: 'https://99designs-blog.imgix.net/blog/wp-content/uploads/2022/06/Starbucks_Corporation_Logo_2011.svg-e1657703028844.png?auto=format&q=60&fit=max&w=930',
            username: 'user12',
            password: 'user123'
        },
        {
            id: 1,
            firstName: 'Admin',
            secondName: 'Admin',
            roles: ['ADMIN'],
            logoSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ584acfWMPuHP7nRm1z5_Yt5zLmKyGrANsQ&s',
            username: 'admin',
            password: 'admin123'
        },
    ]

    const mainStore = useMainStore()
    const { currentUser } = storeToRefs(mainStore)

    const login = (email, password) => {
        const user = users.find(user => user.username === email && user.password === password)
        
        if (user) {
            currentUser.value = user
        }

        const response = {
            result: user,
            error: user ? false : true,
            message: user ? '' : 'User not found',
            code: user ? 200 : 400
        }
        return response
    }

    const register = (user) => {
        const response = {
            result: null,
            error: true,
            message: 'Server is available',
            code: 500
        }
        return response
    }

    return {
        login, register
    }
}