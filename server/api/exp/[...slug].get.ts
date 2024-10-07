import { getUserByEmail, getItemRating, dateFormatter } from "~/server/utils"
import { getServerSession } from '#auth'
import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    const user = await getUserByEmail(session?.user?.email)

    const { sortBy, direction } = getQuery(event)

    const options = {
        'rating': {
            rating: direction
        },
        'date-added': {
            updatedAt: direction
        }
    }[sortBy as string]

    try {
        const item = await prisma.experiment.findUniqueOrThrow({
            where: {
                slug: event.context.params?.slug
            },
            include: {
                reviews: {
                    orderBy: options as any,
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                photoUrl: true
                            }
                        }
                    }
                }
            }
        })

        item.reviews?.forEach((review: any, index: any) => {
            item.reviews[index] = { ...review, updatedAt: dateFormatter(review?.updatedAt) }
        })

        if (item.reviews?.length !== 0 && !options && user)
            item.reviews?.unshift(
                item.reviews?.splice(
                    item.reviews?.findIndex(review => review?.authorId === user?.id), 1
                )[0]
            )

        return { ...item, rating: getItemRating(item) }
    } 
    catch(e) {
        throw createError({
            statusCode: 404,
            statusMessage: 'We couldn\'t find that item.'
        })
    }
})
