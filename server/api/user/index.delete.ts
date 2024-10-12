
import { getServerSession } from '#auth'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    
    await prisma.user.delete({
        where: {
            email: session?.user?.email as string
        }
    })

    return {
        message: 'Account deleted successfully!'
    }
})
