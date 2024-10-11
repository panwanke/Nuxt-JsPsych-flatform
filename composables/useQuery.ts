export default function useQuery(event: unknown) {
    const router = useRouter()
    return {
        sortBy: router.currentRoute.value.query?.sortBy,
        direction: router.currentRoute.value.query?.direction,
        search: router.currentRoute.value.query?.search,
        id: router.currentRoute.value.query?.Id,
        page: router.currentRoute.value.query?.page,
    }
}
