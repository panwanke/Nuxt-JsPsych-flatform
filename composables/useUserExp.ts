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
    async function getSlugs() {
        if (loggedIn) {
            const { data } = await useFetch('/api/user/userexp')
            return (data.value as any).map((item: any) => item.slug)
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

    async function addItem(id: String) {
        if (loggedIn) {
            await useFetch('/api/user/favorites', {
                method: 'POST',
                query: {
                    ids: Array.of(id)
                }
            })
        }
        else if (process.client) {
            const ids = await getIds()
            if (!ids.includes(id)) {
                ids.push(id)
                localStorage.setItem('favorites', JSON.stringify(Array.from(ids)))
            }
        }
        bus.emit('favorites')
        toast.success("实验添加到“已参与”面板!")
    }

    async function removeItem(id: String) {
        if (loggedIn) {
            await useFetch('/api/user/favorites', {
                method: 'DELETE',
                query: {
                    id: id
                }
            })
        }
        else if (process.client) {
            const ids = await getIds()
            const index = ids.indexOf(id)
            if (index !== -1) {
                ids.splice(index, 1)
                localStorage.setItem('favorites', JSON.stringify(Array.from(ids)))
            }
        }
        bus.emit('favorites')
        toast.success("实验已从参加面板移除!")
    }

    async function syncItems() {
        const ids = JSON.parse(localStorage.getItem('favorites') ?? '[]')
        if (ids.length) {
            await useFetch('/api/user/favorites', {
                method: 'POST',
                query: {
                    ids: ids
                }
            })
            localStorage.removeItem('favorites')
            bus.emit('favorites')
            return true
        }
        return false
    }

    return { getItems, getIds, getCount, syncItems, addItem, removeItem }
}
