import { getUserByEmail, getItemRating } from '~/server/utils'
import { getServerSession } from '#auth'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    const user = await getUserByEmail(session?.user?.email)
    // if (!user?.id) return []
    // const user = { id: 1}
    // console.log('user',user)

    const { sortBy, direction } = getQuery(event)

    const options = {
        'price': {
            price: direction
        },
        'review-count': {
            reviews: {
                _count: direction
            }
        }
    }[sortBy as string]

    const userExperiments = await prisma.userExperiment.findMany({
        where: {
            userId: user?.id,
        },
        include: {
            experiment: true, 
        },
        orderBy: {
            experiment: {
                remuneration: options as any,
            },
        },
    });
    
    userExperiments?.forEach((item: any, index: any) => {
        userExperiments[index] = { ...item, rating: getItemRating(item) }
    })

    if (sortBy === 'rating')
        userExperiments?.sort((a: any, b: any) => direction === 'asc' ? a.rating - b.rating : b.rating - a.rating)

    return userExperiments
})
