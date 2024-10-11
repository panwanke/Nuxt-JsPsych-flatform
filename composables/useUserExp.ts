import { useToast } from 'vue-toastification'

const toast = useToast()

export default function useExp() {
    const query = useQuery()
    const loggedIn = useStatus()
    const bus = useEventBus('count')

    async function getIds() {
        if (loggedIn) {
            const { data } = await useFetch('/api/user/userexp')
            return (data.value as any).map((item: any) => item.id)
        }
        else if (process.client) {
            return JSON.parse(localStorage.getItem('userexp') ?? '[]')
        }
    }

    async function getCount() {
        return (await getIds())?.length
    }
    
    async function getItems() {
        if (loggedIn) {
            const headers = useRequestHeaders(['cookie'])
            const { data } = await useAsyncData('userexp', () => $fetch('/api/user/userexp', {
                query: query,
                headers,
            }))
            return data.value
        }else{
            return []
        }
    }

    return { getItems, getIds, getCount }
}
