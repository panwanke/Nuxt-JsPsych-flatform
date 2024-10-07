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

    async function getAll() {
        const {data} = await useFetch('/api/exp',{
            query: {
                  sortBy: 'rating',
                  direction: 'desc'
            }
          })
        
        return data.value
    }

    async function getByPage(){}
    
    return { 
        getAll,
     }
}
